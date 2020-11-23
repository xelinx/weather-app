//Variable for city
var cityName = $("cityName").val();

//Array for history of search
var cities = [];

// This is our API key, latitude, and longitude
var APIKey = "4329b9a304464e3aaf6df7df53ecd8b3";

//Current Weather forecast
function getWeather(cityName) {

  // Here we are building the URL we need to query the database
  let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + APIKey;


  // AJAX call to the OpenWeatherMap API
  $.ajax({
    url: queryURL,
    method: "GET",
  })
    // We store all of the retrieved data inside of an object called "response"
    .then(function (response) {

      // Log the results
      console.log(response);

      // Get Today's Date and Forecast
      const date = document.getElementById("city");
      const currentDate = new Date(response.dt * 1000);
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      console.log(currentDate);
      date.innerHTML = month + "/" + day + "/" + year;

      var icon = response.weather[0].icon;
      var temp = response.main.temp;
      var humidity = response.main.humidity;
      var wind = response.wind.speed;

      $(".city").text(cityName);
      $(".icon").attr("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png");
      $(".tempF").text("Temp: " + temp.toFixed(2) + "ºF");
      $(".humidity").text("Humidity: " + humidity + "%");
      $(".wind").text("Wind Speed: " + wind + "mph");

      // Define lat/lon for AJAX call
      let lat = response.coord.lat;
      let lon = response.coord.lon;

      // AJAX call to API (including UVI)
      let UVQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely,alerts&units=imperial&appid=" + APIKey;
      $.ajax({
        url: UVQueryURL,
        method: "GET",
      })
        // log response
        .then(function (response) {
          console.log(response);

          //Get UVI
          var UVI = response.current.uvi
          $(".UV").text("UVI: " + UVI.toFixed(2));

          //Get 5-Day Forecast
          const forecast = document.querySelectorAll(".forecast");
          for (i = 0; i < forecast.length; i++) {
            forecast[i].innerHTML = "";
            const forecastIndex = i + 1;
            const forecastDate = new Date(response.daily[forecastIndex].dt * 1000);
            const forecastDay = forecastDate.getDate();
            const forecastMonth = forecastDate.getMonth() + 1;
            const forecastYear = forecastDate.getFullYear();
            const forecastDateP = document.createElement("p");
            forecastDateP.setAttribute("class", "mt-3 mb-3 forecast-date");
            forecastDateP.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
            forecast[i].append(forecastDateP);
            const forecastWeather = document.createElement("img");
            forecastWeather.setAttribute("src", "https://openweathermap.org/img/wn/" + response.daily[forecastIndex].weather[0].icon + "@2x.png");
            forecastWeather.setAttribute("alt", response.daily[forecastIndex].weather[0].description);
            forecast[i].append(forecastWeather);
            const forecastTemp = document.createElement("p");
            forecastTemp.innerHTML = "Temp: " + response.daily[forecastIndex].temp.day + " ºF";
            forecast[i].append(forecastTemp);
            const forecastHumidity = document.createElement("p");
            forecastHumidity.innerHTML = "Humidity: " + response.daily[forecastIndex].humidity + "%";
            forecast[i].append(forecastHumidity);
          }
        })
    });
};

//Search/Clear Function
var searchBtn = document.getElementById("searchBtn");
var search = document.getElementById("cityName");
var clearBtn = document.getElementById("clearBtn");

searchBtn.addEventListener("click", function () {
  var searchTerm = search.value;
  getWeather(searchTerm);
  searchHistory.push(searchTerm);
  localStorage.setItem("search", JSON.stringify(searchHistory));
  renderSearchHistory();
});

//Search History Function
var searchHistory = JSON.parse(localStorage.getItem("search")) || [];

function renderSearchHistory() {
  var history = document.getElementById("history");
  history.innerHTML = "";

  for (let i = 0; i < searchHistory.length; i++) {
    var historyItem = document.createElement("input");
    historyItem.setAttribute("type", "text");
    historyItem.setAttribute("readonly", true);
    historyItem.setAttribute("class", "form-control d-block bg-white");
    historyItem.setAttribute("value", searchHistory[i]);
    historyItem.addEventListener("click", function () {
      getWeather(historyItem.value);
    })
    history.append(historyItem);
  }
}

renderSearchHistory();
if (searchHistory.length > 0) {
  getWeather(searchHistory[searchHistory.length - 1]);
}

//Clear History Function

clearBtn.addEventListener("click", function () {
  searchHistory = [];
  renderSearchHistory();
});