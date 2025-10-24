const apiKey = "40a7998d8d72806a4e967ef460947371";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const weatherIcon = document.getElementById("weatherIcon");
const weatherResult = document.getElementById("weatherResult");
const error = document.getElementById("error");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city === "") {
    error.textContent = "Please enter a city name!🙏";
    return;
  }

  error.textContent = "";

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => {
      if (!response.ok) {
        throw new Error("City not found!");
      }
      return response.json();
    })
    .then(data => {
      cityName.textContent = `${data.name}, ${data.sys.country}`;
      temperature.textContent = `🌡️ ${data.main.temp}°C`;
      description.textContent = `☁️ ${data.weather[0].description}`;
      const iconCode = data.weather[0].icon;
      weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

      weatherResult.classList.remove("hidden");
    })
    .catch(err => {
      error.textContent = err.message;
      weatherResult.classList.add("hidden");
    });
});
