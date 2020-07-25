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

            // Transfer content to HTML
            $(".city").html(response.name);
            $(".icon").attr("src", icon);
            $(".tempF").html("Temperature:" + response.current.temp.toFixed(2) + "ºF");
            $(".humidity").text("Humidity: " + response.current.humidity);
            $(".wind").text("Wind Speed: " + response.current.wind.speed);
            $(".UV").text("UV Index: " + response.current.uvi);

            // Log the data in the console as well
            console.log("Temperature (F): " + current.temp);
            console.log("Humidity: " + response.current.humidity);
            console.log("Wind Speed: " + response.current.wind.speed);
            console.log("UV Index: " + response.current.uvi);

            //UVI changes colors on conditions
            var uvi = response.current.uvi;

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

 