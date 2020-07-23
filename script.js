    //Variable for city
    var cityName = document.getElementById("cityName");

    //Array for history of search

    
    // This is our API key
    var APIKey = "4329b9a304464e3aaf6df7df53ecd8b3";

    // Here we are building the URL we need to query the database
    var queryURL = "api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&exclude=hourly&units=imperial&appid=" +
    + APIKey;

    // AJAX call to the OpenWeatherMap API
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      // We store all of the retrieved data inside of an object called "response"
      .then(function(response) {

        // Log the queryURL
        console.log(queryURL);

        // Log the resulting object
        console.log(response);

        // Transfer content to HTML
        $(".city").html(response.name);
        $(".tempF").html("Temperature:" + response.tempF.toFixed(2));
        $(".humidity").text("Humidity: " + response.main.humidity);
        $(".wind").text("Wind Speed: " + response.wind.speed);
        $(".UV").text("UV Index: " + response.uvi);

        // Log the data in the console as well
        console.log("Temperature (F): " + tempF);
        console.log("Humidity: " + response.main.humidity);
        console.log("Wind Speed: " + response.wind.speed);
        console.log("UV Index: " + response.uvi);
      });