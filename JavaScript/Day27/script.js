// Import
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";

// Elements
const form = document.getElementById("regForm");
const submitBtn = document.getElementById("submitBtn");

const fields = {
  firstName: document.getElementById("firstName"),
  lastName: document.getElementById("lastName"),
  email: document.getElementById("email"),
  username: document.getElementById("username"),
  password: document.getElementById("password"),
  country: document.getElementById("country"),
  city: document.getElementById("city"),
  countryCode: document.getElementById("countryCode"),
  phone: document.getElementById("phone"),
  dob: document.getElementById("dob"),
  ageYears: document.getElementById("ageYears"),
  ageMonths: document.getElementById("ageMonths"),
  appointment: document.getElementById("appointment"),
};

const icons = {
  firstName: document.getElementById("icon-firstName"),
  lastName: document.getElementById("icon-lastName"),
  email: document.getElementById("icon-email"),
  username: document.getElementById("icon-username"),
  password: document.getElementById("icon-password"),
  country: document.getElementById("icon-country"),
  city: document.getElementById("icon-city"),
  phone: document.getElementById("icon-phone"),
  dob: document.getElementById("icon-dob"),
  appointment: document.getElementById("icon-appointment"),
};

const errors = {
  firstName: document.getElementById("err-firstName"),
  lastName: document.getElementById("err-lastName"),
  email: document.getElementById("err-email"),
  username: document.getElementById("err-username"),
  password: document.getElementById("err-password"),
  country: document.getElementById("err-country"),
  city: document.getElementById("err-city"),
  phone: document.getElementById("err-phone"),
  dob: document.getElementById("err-dob"),
  appointment: document.getElementById("err-appointment"),
};

// Eye toggle
const togglePasswordBtn = document.getElementById("togglePassword");
const eyeIcon = document.getElementById("eyeIcon");

// City data & country->code
const CITY_DATA = {
  India: ["Mumbai", "Delhi", "Bengaluru", "Pune", "Ahmedabad"],
  USA: ["New York", "Los Angeles", "Chicago", "Houston", "Seattle"],
  UK: ["London", "Manchester", "Birmingham", "Leeds"],
  UAE: ["Dubai", "Abu Dhabi", "Sharjah"],
  Australia: ["Sydney", "Melbourne", "Brisbane", "Perth"],
  China: ["Beijing", "Wuhan", "Shanghai", "Shenzhen"],
};
const COUNTRY_TO_CODE = {
  India: "+91",
  USA: "+1",
  UK: "+44",
  UAE: "+971",
  Australia: "+61",
  China: "+86",
};

// Dynamically create element of countries
// console.log(Object.keys(CITY_DATA));
fields.country.innerHTML = '<option value="">Select Country</option>';
Object.keys(CITY_DATA).forEach((key) => {
  const opt = document.createElement("option");
  opt.value = key;
  opt.textContent = key;
  fields.country.appendChild(opt);
});

// Map city and country code with Country Selected -> change

fields.country.addEventListener("change", (event) => {
  // load city based on country and load country code
  //   console.log("Event -- ", event);
  let selectedCountry = fields.country.value;
  fields.city.innerHTML = '<option value="">Select City</option>';

  if (CITY_DATA[selectedCountry]) {
    // load cities
    CITY_DATA[selectedCountry].forEach((city) => {
      const opt = document.createElement("option");
      opt.value = city;
      opt.textContent = city;
      fields.city.appendChild(opt);
    });
    fields.city.disabled = false;
  } else {
    fields.city.disabled = true;
  }

  if (COUNTRY_TO_CODE[selectedCountry]) {
    //Load country code

    Object.keys(COUNTRY_TO_CODE).forEach((key) => {
      const opt = document.createElement("option");
      opt.value = COUNTRY_TO_CODE[key];
      opt.textContent = COUNTRY_TO_CODE[key];
      fields.countryCode.appendChild(opt);
    });
    fields.countryCode.value = COUNTRY_TO_CODE[selectedCountry];
    fields.countryCode.disabled = false;
  } else {
    fields.countryCode.disabled = true;
  }
});

// set state to untouched for all fields
const touched = {};
Object.keys(fields).forEach((key) => (touched[key] = false));

// Logic for validations -> All Input Fields Validation Functions
const validators = {
  firstName: (value) => value.trim() !== "",
  lastName: (value) => value.trim() !== "",
  // Regular Expression -> Regex (Patterns Match)
  // no space and common email validation
  email: (value) => /^\S+@\S+\.\S+$/.test(value),
  username: (value) => value.trim() !== "" && !/\s/.test(value),
  password: (value) =>
    /^(?=.*[A-Z])(?=.*[!@#$%^&*+])(?=.*\d)\S{8,}$/.test(value),
  country: (value) => value.trim() !== "",
  city: (value) => value.trim() !== "",
  phone: (value) => /^\d{7,15}$/.test(value),
  dob: (value) => {
    if (!value) {
      return false;
    }
    const dobDate = new Date(value);
    return dobDate <= new Date();
  },
  appointment: (value) => {
    if (!value) {
      return false;
    }

    const apointmentDate = new Date(value);
    return apointmentDate >= new Date();
  },
};

const messages = {
  firstName: "First name cannot be empty",
  lastName: "Last name cannot be empty",
  email: "Enter valid email (no spaces)",
  username: "Username cannot be empty of contains spaces",
  password: "Min 8 characters, 1 Uppercase, 1 Special Characters, 1 Digit",
  country: "Please select country",
  city: "Please select city",
  phone: "Phone number must be number between 7 to 15 digits",
  dob: "Please select valid DOB",
  appointment: "Previous dates are not applicable",
};

// Utility functions -- Helper Functions
// set Valid State / set Invalid State

function setValidState(id) {
  const element = fields[id];
  // console.log(element);
  const icon = icons[id];

  element.classList.remove("invalid");
  element.classList.add("valid");
  if (icon) {
    icon.className = "fa input-icon valid fa-regular fa-circle-check";
  }
  if (errors[id]) {
    errors[id].textContent = "";
  }
}

function setInValidState(id) {
  const element = fields[id];
  const icon = icons[id];

  element.classList.remove("valid");
  element.classList.add("invalid");

  icon.className = "fa input-icon invalid fa-regular fa-circle-xmark";
  if (touched[id]) {
    errors[id].textContent = messages[id];
  }
}

function clearState(id) {
  const element = fields[id];
  const icon = icons[id];

  element.classList.remove("invalid", "valid");
  if (icon) {
    icon.className = "fa input-icon";
  }
  if (errors[id]) {
    errors[id].textContent = "";
  }
}

// Main Function Which will be called to check validations for each field
function validateField(id, showImmediately = false) {
  const element = fields[id];
  const value = (element.value || "").trim();

  // check if that field is touched or untouched
  if (!touched[id] && !showImmediately) {
    clearState(id);
    return validators[id] ? validators[id](value) : true;
  }

  let validResponse = validators[id] ? validators[id](value) : true;

  if (validResponse) {
    setValidState(id);
  } else {
    setInValidState(id);
  }
  return validResponse;
}

// On Focus on any field mark that field as touched -> change false to true

Object.keys(fields).forEach((formField) => {
  fields[formField].addEventListener("focus", () => {
    touched[formField] = true;
  });
});

// Call validator when blur

Object.keys(fields).forEach((formField) => {
  // console.log(fields[formField]);
  fields[formField].addEventListener("blur", () => {
    validateField(formField, true);
    updateSubmitButton();
  });
});

// If everything is correct update submiut button
function updateSubmitButton() {
  const allIds = Object.keys(fields);
  // console.log(allIds);
  const allValid = allIds.every((formField) => {
    return validateField(formField, false); // it won't check for untouched
  });
  submitBtn.disabled = !allValid;
  submitBtn.classList.toggle("active", allValid);
}

// Logic for Age in years and months
fields.dob.addEventListener("change", () => {
  const dateValue = fields.dob.value;

  if (!dateValue) {
    fields.ageYears.value = "";
    fields.ageMonths.value = "";
  }

  const dobDate = new Date(dateValue);
  const now = new Date();
  let years = now.getFullYear() - dobDate.getFullYear();
  let months = now.getMonth() - dobDate.getMonth();

  if (months < 0) {
    years--;
    months = months + 12;
  }

  fields.ageYears.value = `${years} years`;
  fields.ageMonths.value = `${months} months`;
  touched.dob = true;
  validateField("dob", true);
  updateSubmitButton();
});

// Toggle Password
togglePasswordBtn.addEventListener("click", () => {
  const pwd = fields.password;
  const showing = pwd.type === "text";

  pwd.type = showing ? "password" : "text";

  // eye button to be changes

  eyeIcon.classList.toggle("fa-eye");
  eyeIcon.classList.toggle("fa-eye-slash");
});

// submit logic
form.addEventListener("submit", (event) => {
  event.preventDefault();

  // mark all as touched and check for validations
  Object.keys(touched).forEach((field) => {
    touched[field] = true;
  });
  const allIds = Object.keys(fields);

  const allValids = allIds.every((id) => validateField(id, true));
  if (allValids) {
    // backend call

    // show alert with a message form submitted
    Swal.fire({
      title: "Done!",
      text: "Data Saved Successfully🎉",
      icon: "success",
    });

    form.reset();
    // clear all UI
    Object.keys(fields).forEach((field) => {
      fields[field].classList.remove("valid", "invalid");
      if (icons[field]) {
        icons[field].className = "fa input-icon";
      }
      if (errors[field]) {
        errors[field].textContent = "";
      }
      touched[field] = false;
    });

    // disabled country code and city
    fields.countryCode.disabled = true;
    fields.city.disabled = true;

    submitBtn.disabled = true;
    submitBtn.classList.remove("active");

    // restore password to password and with eye icon
    fields.password.type = "password";
    eyeIcon.classList.add("fa-eye");
    eyeIcon.classList.remove("fa-eye-slash");
  } else {
    allIds.forEach((id) => validateField(id, true));

    // extra feature -> focus on first error form input
    const firstInvalid = allIds.find((id) => !validateField(id, true));

    if (firstInvalid) {
      fields[firstInvalid].focus();
    }
  }
});

updateSubmitButton();