document.addEventListener('DOMContentLoaded', () => {

let currentUnits = localStorage.getItem('weather-app-units') || 'metric';

const qs = sel => document.querySelector(sel);

const searchInput = qs('#search');
const searchBtn = qs('#searchBtn');
const feelsLikeEl = qs('#feelsLike');
const humidityEl = qs('#humidity');
const windEl = qs('#wind');
const precipEl = qs('#precipitation');
const dailyContainer = qs('#dailyForecast');
const hourlyContainer = qs('#hourlyForecast');
const placeNameEl = qs('#placeName');
const currentDateEl = qs('#currentDate');
const currentTempEl = qs('#currentTemperature');
const currentIconEl = qs('#currentWeatherIcon');
const unitsToggle = qs('#unitsToggle');
const errorMessageEl = qs('#errorMessage'); // Element for error messages

function setLoading(isLoading) {
  if (!searchBtn) return;
  searchBtn.textContent = isLoading ? 'Searching...' : 'Search';
  searchBtn.disabled = isLoading;
}

function getWeatherIconFromCode(code) {
  // Codes from Open-Meteo:
  // 0-3: Clear/Cloudy
  // 45-48: Fog
  // 51-67: Drizzle/Rain
  // 71-75: Snow
  // 95-99: Thunderstorm
  if (code >= 0 && code <= 3) return '☀️'; // Sunny/Clear/Cloudy
  if (code >= 45 && code <= 48) return '🌫️'; // Fog
  if (code >= 51 && code <= 67) return '🌧️'; // Rain
  if (code >= 71 && code <= 75) return '🌨️'; // Snow
  if (code >= 95 && code <= 99) return '⛈️'; // Thunderstorm
  return '';
}

async function getCoordinates(query) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Oops! Something went wrong while trying to find your location. Please try again.');
  }
  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    throw new Error(`Hmm, couldn't find "${query}". Double-check the spelling or try a different place!`);
  }
  const r = data.results[0];
  // Make the place name a bit more user-friendly, e.g., "London, United Kingdom"
  // instead of just "London" if country is available.
  return { lat: r.latitude, lon: r.longitude, name: r.name + (r.country ? ', ' + r.country : '') };
}

async function fetchWeather(lat, lon, units) {
  const isMetric = units === 'metric';
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current_weather: 'true',
    hourly: 'temperature_2m,relativehumidity_2m,apparent_temperature,precipitation,weathercode',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode',
    temperature_unit: isMetric ? 'celsius' : 'fahrenheit',
    windspeed_unit: isMetric ? 'kmh' : 'mph',
    precipitation_unit: isMetric ? 'mm' : 'inch',

    timezone: 'auto',
    forecast_days: '7'
  });
  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Couldn\'t fetch the weather data right now. The weather gods might be busy!');
  }
  return res.json();
}

function findNearestIndex(times) {
  const now = Date.now();
  let bestIdx = 0;
  let bestDiff = Infinity;
  for (let i = 0; i < times.length; i++) {
    const t = Date.parse(times[i]);
    const diff = Math.abs(t - now);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i;
    }
  }
  return bestIdx;
}

function clearChildren(el) { while (el && el.firstChild) el.removeChild(el.firstChild); }

function renderAll(data, placeName, units) {
  // Clear any previous error messages
  if (errorMessageEl) errorMessageEl.textContent = '';

  const { current_weather, hourly, daily } = data;

  if (placeNameEl) placeNameEl.textContent = placeName;
  if (currentDateEl) {
    const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
    // The image only shows "Tuesday, Aug 5, 2025" - I'll stick to the existing format.
    currentDateEl.textContent = new Date(current_weather.time).toLocaleDateString('en-US', options); 
  }

  const isMetric = units === 'metric';
  // The temperature unit is now implied in the display (e.g., just '20°' in the image)
  // The actual unit logic is still correctly handled by the API call.

  if (currentTempEl) currentTempEl.textContent = `${Math.round(current_weather.temperature)}°`;
  if (currentIconEl) currentIconEl.textContent = getWeatherIconFromCode(current_weather.weathercode);

  const idx = findNearestIndex(hourly.time);
  const feelsLike = hourly.apparent_temperature ? hourly.apparent_temperature[idx] : current_weather.temperature;
  const humidity = hourly.relativehumidity_2m ? hourly.relativehumidity_2m[idx] : undefined;
  const precip = hourly.precipitation ? hourly.precipitation[idx] : undefined;

  const windUnit = isMetric ? 'km/h' : 'mph';
  const precipUnit = isMetric ? 'mm' : 'in';

  if (feelsLikeEl) feelsLikeEl.textContent = `${Math.round(feelsLike)}°`; // "Feels like" temperature
  if (humidityEl) humidityEl.textContent = humidity != null ? `${humidity}%` : '—';
  if (windEl) windEl.textContent = `${current_weather.windspeed} ${windUnit}`;
  if (precipEl) precipEl.textContent = precip != null ? `${precip.toFixed(1)} ${precipUnit}` : '—';

  // --- Daily Forecast Rendering ---
  if (dailyContainer) {
    clearChildren(dailyContainer);
    for (let i = 0; i < daily.time.length; i++) {
      const card = document.createElement('div');
      card.className = 'card daily-card';
      const day = daily.time[i];
      // Use 'short' for Tue, Wed, Thu... as in the image
      const dayName = new Date(day).toLocaleDateString('en-US', { weekday: 'short' }); 
      const max = Math.round(daily.temperature_2m_max[i]);
      const min = Math.round(daily.temperature_2m_min[i]); 
      const icon = getWeatherIconFromCode(daily.weathercode ? daily.weathercode[i] : -1);
      
      // The image shows MAX/MIN temp, e.g., '20°/14°'
      card.innerHTML = `
        <strong>${dayName}</strong>
        <div>${icon}</div>
        <div>${max}°/${min}°</div>
      `;
      dailyContainer.appendChild(card);
    }
  }

  // --- Hourly Forecast Rendering (24 hours from current) ---
  if (hourlyContainer) {
    clearChildren(hourlyContainer);
    const start = idx;
    // Iterate for the next 24 hours starting from the nearest hour
    for (let i = start; i < Math.min(hourly.time.length, start + 24); i++) {
      const el = document.createElement('div');
      el.className = 'hour hourly-item';
      // Format to '3 PM', '4 PM', etc., as in the image
      const hourLabel = new Date(hourly.time[i]).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
      const t = Math.round(hourly.temperature_2m[i]);
      const icon = getWeatherIconFromCode(hourly.weathercode ? hourly.weathercode[i] : -1);
      
      el.innerHTML = `
        <div>${hourLabel}</div>
        <div>${icon}</div>
        <div>${t}°</div>
      `;
      hourlyContainer.appendChild(el);
    }
  }
}

async function doSearch(query) {
  try {
    // Clear the error message at the start of a search
    if (errorMessageEl) errorMessageEl.textContent = ''; 
    setLoading(true);
    const place = await getCoordinates(query); 
    const data = await fetchWeather(place.lat, place.lon, currentUnits);
    renderAll(data, place.name, currentUnits);
  } catch (err) {
    // Display a user-friendly error message
    if (errorMessageEl) errorMessageEl.textContent = err.message || 'Something went wrong. Please try again later!';
    console.error(err);
  } finally {
    setLoading(false);
  }
}

const handleSearch = () => {
  const query = searchInput.value.trim();
  if (query) {
    doSearch(query);
  } else { 
    // Show a message instead of an alert for better UX
    if (errorMessageEl) errorMessageEl.textContent = 'Please enter a city name to search.';
    searchInput.focus();
  }
};

searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSearch();
});

unitsToggle.addEventListener('change', (e) => {
  // Toggle between 'metric' (default/unchecked) and 'imperial' (checked)
  currentUnits = e.target.checked ? 'imperial' : 'metric';
  localStorage.setItem('weather-app-units', currentUnits);
  const currentQuery = searchInput.value.trim();
  if (currentQuery) {
    // Re-run search with the new units
    doSearch(currentQuery);
  }
});

function initializeApp() {
  // Set the units toggle state based on localStorage
  unitsToggle.checked = currentUnits === 'imperial';

  const defaultCity = 'Berlin';
  searchInput.value = defaultCity; // Pre-fill with a default city
  doSearch(defaultCity);
}

initializeApp();
});