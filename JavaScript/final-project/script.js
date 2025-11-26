const apiKey = "bcd772c692ee42b1adb101143251009";
const cityInput = document.querySelector("#city");
const cityError = document.querySelector("#cityError");
const daysInput = document.querySelector("#days");
const daysError = document.querySelector("#daysError");
const weatherDiv = document.querySelector("#weather");
const loader = document.querySelector("#loader");

const form = document.querySelector("form");

// loader.classList.remove("hide");

function validateCityInput(cityValue) {
  let isValid = true;

  if (!cityValue) {
    isValid = false;
    cityError.classList.remove("hide");
  } else {
    cityError.classList.add("hide");
  }
  return isValid;
}
function validateDaysInput(daysValue) {
  let isValid = true;

  if (!daysValue) {
    isValid = false;
    daysError.classList.remove("hide");
  } else {
    daysError.classList.add("hide");
  }
  return isValid;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let cityError = validateCityInput(cityInput.value);
  let daysError = validateDaysInput(daysInput.value);

  if (cityError && daysError) {
    // then fetch result from API

    fetchWeatherInfo(cityInput.value, daysInput.value);
  }
});

// helper function to fetch flag by country name
async function getFlag(countryName) {
  try {
    const response = await axios.get(
      `https://restcountries.com/v3.1/name/${countryName}?fullText=true`
    );
    const data = response.data;
    // console.log(data);

    if (Array.isArray(data) && data.length > 0) {
      // return flag image url
      return data[0].flags.png || data[0]["flags"]["svg"];
    }
  } catch (e) {
    console.log(e);
  }
  return "fallback.png";
}

async function fetchWeatherInfo(cityValue, daysValue) {
  loader.classList.remove("hide");

  weatherDiv.innerHTML = "";

  try {
    const apiResponse = await axios.get(
      `https://api.weatherapi.com/v1/forecast.json`,
      {
        params: {
          q: cityValue,
          days: daysValue,
          key: apiKey,
        },
      }
    );
    const data = apiResponse.data;
    // console.log(data);

    // get Flag
    const flagImage = await getFlag(data.location.country);
    // console.log(flagImage);

    const date = new Date(data.location.localtime_epoch * 1000);

    // convert to 12 hour format

    const formattedTime = date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    setTimeout(() => {
      if (cityValue.includes(",")) {
        cityInput.value = data.location.name;
      } else {
        cityInput.value = cityValue;
      }
      let htmlContent = `
    <h2>${data.location.name}, ${data.location.region}, ${data.location.country}</h2>

    <img class="flag-image" src="${flagImage}" alt="Flag Icon">
    <h3>${formattedTime}</h3>
    <p>Current: ${data.current.temp_c}℃, ${data.current.condition.text}</p>
    <p>Wind Speed: ${data.current.wind_mph} m/h</p>
    <p>Cloud: ${data.current.cloud}%</p>
    <p>Humidity: ${data.current.humidity}%</p>
    <img src="${data.current.condition.icon}" alt="Cloud Icon">
    <h3>Forecast</h3>
    `;
      data.forecast.forecastday.forEach((day) => {
        htmlContent =
          htmlContent +
          `
        <div class="forecast-item">
        <strong>
          ${day.date}
        </strong>
        <br>
        ${day.day.condition.text}
        <br>
        Max: ${day.day.maxtemp_c}℃, Min: ${day.day.mintemp_c}℃ 
        <br>
        <img src= "${day.day.condition.icon}" alt="Cloud Icon">
        </div>
      `;
      });
      weatherDiv.innerHTML = htmlContent;
      weatherDiv.classList.add("show");
      loader.classList.add("hide");
    }, 3000);
  } catch (error) {
    weatherDiv.innerHTML = `
      <img class="error" src = "error.png">
      <p style='color:red;'>Error fetching data. Try again</p>`;
    weatherDiv.classList.add("show");
    loader.classList.add("hide");
  }
}

document.querySelector("#currentLocationBtn").addEventListener("click", () => {
  // Forecast Days Validations
  const days = daysInput.value;
  const daysValid = validateDaysInput(days);
  if (!daysValid) {
    validateCityInput("No Validate");
    return;
  }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherInfo(
          `${position.coords.latitude},${position.coords.longitude}`,
          days
        );
      },
      () => {
        alert("Please allow Current Location");
      }
    );
  } else {
    alert("Current Location Not Supported");
  }
});