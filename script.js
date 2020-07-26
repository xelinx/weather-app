  //Variable for city
  var cityName = document.getElementById("cityName");
  let lat = [];
  let lon = [];

  //Array for history of search
  var cities = [];
  
  // This is our API key, latitude, and longitude
  var APIKey = "4329b9a304464e3aaf6df7df53ecd8b3";

  //Current Weather forecast
  function getWeather(cityName) {

    // Here we are building the URL we need to query the database
    var queryURL = "api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" +
    + APIKey;

    // AJAX call to the OpenWeatherMap API
    $.ajax({
      url: queryURL,
      method: "GET",
    })
      // We store all of the retrieved data inside of an object called "response"
      .then(function(response) {
        console.log(response);

            // Log the queryURL
            console.log(queryURL);

            // Log the resulting object
            console.log(response);

            //Date Display
            var currentDate = new Date(response.dt*1000);
            console.log(currentDate);
            var day = currentDate.getDate();
            var month = currentDate.getMonth() + 1;
            var year = currentDate.getFullYear();
            city.innerHTML = response.name + " (" + month + "/" + day + "/" + year + ") ";

            //Variables
            var icon = response.weather[0].icon;
            var temp = response.main.temp;
            var humidity = response.main.humidity;
            var wind = response.wind.speed;

            // Transfer content to HTML
            //$(".city").append(cityName);
            $(".icon").attr("src", "http://openweathermap.org/img/w/" + icon + "@2x.png");
            $(".tempF").text(temp.toFixed(2) + "ºF");
            $(".humidity").text(humidity + "%");
            $(".wind").text(wind + "mph");

            //Define lat/lon
            let lat = response.coord.lat;
            let lon = response.coord.lon;

            //Get UV
            let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
            $.ajax({
              url: UVQueryURL,
              method: "GET",
            })
            .then(function(response){
                let UVIndex = "";
                UVIndex.setAttribute("class","badge badge-danger");
                UVIndex.innerHTML = response.value;
                $(".UV").append(UVIndex);

              //UVI changes colors on conditions

              if (uvi >= 10){
                  color= "red";
              }
              else if (uvi > 4){
                  color= "yellow";
              }
              else if  (uvi <= 4){
                  color= "green";
              }
            });

          //5-day forecast
          let cityID = response.data.id;
          let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
          
          //Forecast ajax call
          $.ajax({
            url: forecastQueryURL,
              method: "GET",
          })
          
          //Display Forecast
          .then(function(response){
              console.log(response);
              var forecast = document.querySelectorAll(".forecast");
              for (i=0; i<forecast.length; i++) {
                  forecast[i].innerHTML = "";
                  var forecastIndex = i*8 + 4;
                  var forecastDate = new Date(response.list[forecastIndex].dt * 1000);
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
                  forecastWeather.setAttribute("src","https://openweathermap.org/img/wn/" + response.list[forecastIndex].weather[0].icon + "@2x.png");
                  forecastWeather.setAttribute("alt",response.list[forecastIndex].daily.weather[0].description);
                  forecast[i].append(forecastWeather);
                  
                  //Temperature
                  var forecastTemp = document.createElement("p");
                  forecastTemp.innerHTML = "Temp: " + response.list[forecastIndex].daily.temp + " ºF";
                  forecast[i].append(forecastTemp);

                  //Humidity
                  var forecastHumidity = document.createElement("p");
                  forecastHumidity.innerHTML = "Humidity: " + response.list[forecastIndex].daily.humidity + "%";
                  forecast[i].append(forecastHumidity);
              }
            });
          });  
      }
  
    //Search Function
    var searchBtn = document.getElementById("searchBtn");
    var search = document.getElementById("cityName");

    searchBtn.addEventListener("click",function() {
      var searchTerm = search.value;
      getWeather(searchTerm);
      searchHistory.push(searchTerm);
      localStorage.setItem("search",JSON.stringify(searchHistory));
      renderSearchHistory();
    });

    //Search History Function
    var searchHistory = JSON.parse(localStorage.getItem("search")) || [];

    function renderSearchHistory() {
      var history = document.getElementById("history");
      history.innerHTML = "";

      for (let i=0; i<searchHistory.length; i++) {
          var historyItem = document.createElement("input");
          historyItem.setAttribute("type","text");
          historyItem.setAttribute("readonly",true);
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

    //Clear History Function
    clearBtn.addEventListener("click",function() {
      searchHistory = [];
      renderSearchHistory();
    });