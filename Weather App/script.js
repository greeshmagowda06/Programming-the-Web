const searchBtn = document.querySelector('.search-bar button');
const input = document.querySelector('.search-bar input');

const cityName = document.querySelector('.weather-info h3');
const dateElement = document.querySelector('.weather-info p');
const temperature = document.querySelector('.temperature span');
const feelsLike = document.querySelector('.detail-box:nth-child(1) h4');
const humidity = document.querySelector('.detail-box:nth-child(2) h4');
const wind = document.querySelector('.detail-box:nth-child(3) h4');
const precipitation = document.querySelector('.detail-box:nth-child(4) h4');

searchBtn.addEventListener('click', async () => {
  const city = input.value;
  if (!city) return alert('Please enter a city name.');

  try {
    const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      alert('City not found!');
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];
    cityName.textContent = `${name}, ${country}`;
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m`
    );
    const weatherData = await weatherResponse.json();

    const current = weatherData.current;
    temperature.textContent = `${current.temperature_2m}°`;
    feelsLike.textContent = `${current.apparent_temperature}°`;
    humidity.textContent = `${current.relative_humidity_2m}%`;
    wind.textContent = `${current.wind_speed_10m} km/h`;
    precipitation.textContent = `${current.precipitation} mm`;
    const today = new Date();
    const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
    dateElement.textContent = today.toLocaleDateString();
  } catch (error) {
    console.error(error);
    alert('Failed to fetch weather data.');
  }
});
