    //Variable for city
    var cityName = document.getElementById("cityName");

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

    function getWeather(city) {

      //get latitude and longitude
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

            //Variables
            var icon = "http://openweathermap.org/img/w/" + data.weather[0].icon +".png";
            var temp = response.current.temp;
            var humidity = response.current.humidity;
            var wind = response.current.wind_speed;
            var uvi = response.current.uvi;

            // Transfer content to HTML
            $(".city").html(cityName;
            $(".icon").attr("src", icon);
            $(".tempF").text("Temperature:" + temp.toFixed(2) + "ºF");
            $(".humidity").text("Humidity: " + humidity);
            $(".wind").text("Wind Speed: " + wind);
            $(".UV").text("UV Index: " + uvI);

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
    })};

