// Search City value
let city = $("#searchCity").val();

// API Key
const apiKey = "&appid=492e453ab6ca26e928bfbb3e9d824cbd";

let date = new Date();

$("#searchCity").keypress(function(event) { 
	
	if (event.keyCode === 13) { 
		event.preventDefault();
		$("#searchBtn").click(); 
	}
});

// Search Button Click
$("#searchBtn").on("click", function() {

  $('#forecastDays5').addClass('show');

  // Input from search bar
  city = $("#searchCity").val();
  
  $("#searchCity").val("");

  // Call API with key from Open Weather
  const queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;

  // AJAX
  $.ajax({
    url: queryUrl,
    method: "GET"
  })
  .then(function (response){

    console.log(response)

    console.log(response.name)
    console.log(response.weather[0].icon)

    let tempF = (response.main.temp - 273.15) * 1.80 + 32;
    console.log(Math.floor(tempF))

    console.log(response.main.humidity)

    console.log(response.wind.speed)

    getCurrentConditions(response);
    getCurrentForecast(response);
    makeList();
    })
  });

  function makeList() {
    let listItem = $("<li>").addClass("list-group-item").text(city);
    $(".list").append(listItem);
  }

  function getCurrentConditions (response) {

    // Convert temp to F
    let tempF = (response.main.temp - 273.15) * 1.80 + 32;
    tempF = Math.floor(tempF);

    $('#currentCity').empty();

    // Get information from Open Weahter
    const card = $("<div>").addClass("card");
    const cardBody = $("<div>").addClass("card-body");
    const city = $("<h4>").addClass("card-title").text(response.name);
    const cityDate = $("<h4>").addClass("card-title").text(date.toLocaleDateString('en-US'));
    const temperature = $("<p>").addClass("card-text current-temp").text("Temperature: " + tempF + " °F");
    const humidity = $("<p>").addClass("card-text current-humidity").text("Humidity: " + response.main.humidity + "%");
    const wind = $("<p>").addClass("card-text current-wind").text("Wind Speed: " + response.wind.speed + " MPH");
    const image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png")

    // Append to card
    city.append(cityDate, image)
    cardBody.append(city, temperature, humidity, wind);
    card.append(cardBody);
    $("#currentCity").append(card)
   
  }

function getCurrentForecast () {
  
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + apiKey,
    method: "GET"
  }).then(function (response){

    console.log(response)
    console.log(response.dt)
    $('#forecast').empty();

    let results = response.list;
    console.log(results)
    
    for (let i = 0; i < results.length; i++) {

      let day = Number(results[i].dt_txt.split('-')[2].split(' ')[0]);
      let hour = results[i].dt_txt.split('-')[2].split(' ')[1];
      console.log(day);
      console.log(hour);

      if(results[i].dt_txt.indexOf("12:00:00") !== -1){
        
        // Convert temp to F 
        let temp = (results[i].main.temp - 273.15) * 1.80 + 32;
        let tempF = Math.floor(temp);

        const card = $("<div>").addClass("card col-md-2 ml-4 bg-primary text-white");
        const cardBody = $("<div>").addClass("card-body p-3 forecastBody")
        const cityDate = $("<p>").addClass("card-title").text(date.toLocaleDateString('en-US'));
        const temperature = $("<p>").addClass("card-text forecastTemp").text("Temp: " + tempF + " °F");
        const humidity = $("<p>").addClass("card-text forecastHumidity").text("Humidity: " + results[i].main.humidity + "%");
        const image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + results[i].weather[0].icon + ".png")

        // Append to 5 Days
        cardBody.append(cityDate, image, temperature, humidity);
        card.append(cardBody);
        $("#forecast").append(card);
      }
    }
  });
}