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
    console.log(data);

    const date = new Date(data.location.localtime_epoch * 1000);

    console.log(date);
  } catch (error) {
    weatherDiv.innerHTML =
      "<p style='color:red;'>Error fetching data. Try again</p>";
    weatherDiv.classList.add("show");
  }
}