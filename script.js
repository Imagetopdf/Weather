const apiKey = 'a17fe5f494a38383e2a4d9d2bfcf7064';

const cityInput = document.getElementById("cityInput");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const icon = document.getElementById("weatherIcon");
const weatherCard = document.getElementById("currentWeather");
const forecastSection = document.getElementById("weeklyForecast");
const forecastGrid = document.getElementById("forecastCards");
const historyDiv = document.getElementById("searchHistory");

// Current Weather
function getWeather() {
  const city = cityInput.value.trim();
  if (!city) return;

  localStorage.setItem("lastCity", city);
  updateSearchHistory(city);

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      cityName.innerText = `${data.name}, ${data.sys.country}`;
      temperature.innerText = `Temperature: ${data.main.temp} °C`;
      condition.innerText = `Condition: ${data.weather[0].description}`;
      humidity.innerText = `Humidity: ${data.main.humidity}%`;
      wind.innerText = `Wind: ${data.wind.speed} m/s`;
      icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      weatherCard.classList.remove("hidden");
    });

  // 7 Day Forecast
  fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=7&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      forecastGrid.innerHTML = '';
      data.list.forEach(day => {
        const card = document.createElement("div");
        card.classList.add("forecast-card");
        card.innerHTML = `
          <h4>${new Date(day.dt * 1000).toDateString().split(' ').slice(0, 3).join(' ')}</h4>
          <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" />
          <p>${day.temp.day} °C</p>
          <p>${day.weather[0].main}</p>
        `;
        forecastGrid.appendChild(card);
      });
      forecastSection.classList.remove("hidden");
    });
}

// Theme Toggle
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// History
function updateSearchHistory(city) {
  let history = JSON.parse(localStorage.getItem("cityHistory")) || [];
  if (!history.includes(city)) {
    history.push(city);
    localStorage.setItem("cityHistory", JSON.stringify(history));
    renderHistory();
  }
}

function renderHistory() {
  let history = JSON.parse(localStorage.getItem("cityHistory")) || [];
  historyDiv.innerHTML = "<h3>Search History</h3>";
  history.forEach(city => {
    let btn = document.createElement("button");
    btn.textContent = city;
    btn.onclick = () => {
      cityInput.value = city;
      getWeather();
    };
    historyDiv.appendChild(btn);
  });
}

window.onload = () => {
  let last = localStorage.getItem("lastCity");
  if (last) {
    cityInput.value = last;
    getWeather();
  }
  renderHistory();
};
