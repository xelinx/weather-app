  //Variable for city
  var cityName = document.getElementById("cityName");
  let lat = "latitude";
  let lon = "longitude";

  //Array for history of search
  var cities = [];
  
  // This is our API key, latitude, and longitude
  var APIKey = "4329b9a304464e3aaf6df7df53ecd8b3";

  cities.forEach(function (city, index, originalArr) {
    renderButtons(city);
  
    if (index === originalArr.length - 1) {
        getWeather(city);
    }
  })

  //Current Weather forecast
  function getWeather(city) {

    //Get latitude and longitude
    var locURL = "api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" +
    + APIKey;

    // AJAX call to the OpenWeatherMap API
    $.ajax({
      url: locURL,
      method: "GET",
    })
      // We store all of the retrieved data inside of an object called "response"
      .then(function(response) {
        let lat = response.coord.lat;
        let lon = response.coord.lon;

      // Here we are building the URL we need to query the database
      var queryURL = "api.openweathermap.org/data/2.5/weather?q=" + lat + "&lon=" + lon + "&exclude=hourly&units=imperial&appid=" +
      + APIKey;

      // AJAX call to the OpenWeatherMap API
      $.ajax({
      url: queryURL,
        method: "GET",
      })
        // We store all of the retrieved data inside of an object called "response"
        .then(function(response) {

          // Log the queryURL
          console.log(queryURL);

          // Log the resulting object
          console.log(response);

          //Date Display
          var currentDate = new Date(response.data.dt*1000);
          console.log(currentDate);
          var day = currentDate.getDate();
          var month = currentDate.getMonth() + 1;
          var year = currentDate.getFullYear();
          cityName.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";

          //Variables
          var icon = "http://openweathermap.org/img/w/" + data.weather[0].icon +".png";
          var temp = response.current.temp;
          var humidity = response.current.humidity;
          var wind = response.current.wind_speed;
          var uvi = response.current.uvi;

          // Transfer content to HTML
          $(".city").append(cityName);
          $(".icon").attr("src", icon);
          $(".tempF").text(temp.toFixed(2) + "ºF");
          $(".humidity").text(humidity + "%");
          $(".wind").text(wind + "mph");
          $(".UV").text(uvi);

          //UVI changes colors on conditions

          if (uvi >= 10){
              color= "red";
          }
          else if (uvi > 4){
              color= "yellow";
          }
          else if  (uvi <= 4){
              color= "green";
          };
          });

        //5-day forecast
        let cityID = response.data.id;
        let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
        
        //Forecast ajax call
        $.ajax({
          url: forecastQueryURL,
            method: "GET",
          })
        .then(function(response){
            //Display Forecast
            console.log(response);
            var forecast = document.querySelectorAll(".forecast");
            for (i=0; i<forecast.length; i++) {
                forecast[i].innerHTML = "";
                var forecastIndex = i*8 + 4;
                var forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                var forecastDay = forecastDate.getDate();
                var forecastMonth = forecastDate.getMonth() + 1;
                var forecastYear = forecastDate.getFullYear();
                
                //Day box + date
                var forecastDate = document.createElement("p");
                forecastDate.setAttribute("class","mt-3 forecast-date");
                forecastDate.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                forecast[i].append(forecastDate);
                
                //Icon
                var forecastWeather = document.createElement("img");
                forecastWeather.setAttribute("src","https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                forecastWeather.setAttribute("alt",response.data.list[forecastIndex].weather[0].description);
                forecast[i].append(forecastWeather);
                
                //Temperature
                var forecastTemp = document.createElement("p");
                forecastTemp.innerHTML = "Temp: " + response.data.list[forecastIndex].daily.temp + " ºF";
                forecast[i].append(forecastTemp);

                //Humidity
                var forecastHumidity = document.createElement("p");
                forecastHumidity.innerHTML = "Humidity: " + response.data.list[forecastIndex].daily.humidity + "%";
                forecast[i].append(forecastHumidity);
                }
            })
        });  
  };

    //Search Function
    var searchBtn = document.getElementById("searchBtn")
    var search = document.getElementById("cityName");

    searchBtn.addEventListener("click",function() {
      var searchTerm = search.value;
      getWeather(searchTerm);
      searchHistory.push(searchTerm);
      localStorage.setItem("search",JSON.stringify(searchHistory));
      renderSearchHistory();
    })

    //Search History Function
    var searchHistory = JSON.parse(localStorage.getItem("search")) || [];

    function renderSearchHistory() {
      var history = document.getElementById("history");
      history.innerHTML = "";

      for (let i=0; i<searchHistory.length; i++) {
          var historyItem = document.createElement("input");
          historyItem.setAttribute("type","text");
          historyItem.setAttribute("class", "form-control d-block bg-white");
          historyItem.setAttribute("value", searchHistory[i]);
          historyItem.addEventListener("click",function() {
              getWeather(historyItem.value);
          })
          history.append(historyItem);
      }
    }

    renderSearchHistory();
    if (searchHistory.length > 0) {
        getWeather(searchHistory[searchHistory.length - 1]);
    }
    
