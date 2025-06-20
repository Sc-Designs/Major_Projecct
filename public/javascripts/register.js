document.addEventListener("DOMContentLoaded", () => {
let password = document.querySelector("#pass");
let conpass = document.querySelector("#conpass");
let alertpass = document.querySelector("#alertpss");
let alertname = document.querySelector("#alertname");
let name = document.querySelector("#name");
let email = document.querySelector("#email");
let alertemail = document.querySelector("#alertemail");
let age = document.querySelector("#age");
let alertage = document.querySelector("#alertage");
let button = document.querySelector("button");
let eye1 = document.querySelector(".eye1");
let eye2 = document.querySelector(".eye2");
let flag1 = 0;
let flag2 = 0;

conpass.addEventListener("input", () => {
    if (conpass.value === "") return alertpass.innerHTML = "";
  if (conpass.value === password.value) {
    alertpass.innerHTML = "";
    button.disabled = false;
  } else {
    alertpass.innerHTML = "Password does not match";
    button.disabled = true;
  }
});

name.addEventListener("input", () => {
    if (name.value === "") return alertname.innerHTML = "";
  if (/^[A-Za-z\s]+$/.test(name.value)) {
    alertname.innerHTML = "";
    button.disabled = false;
  }
  else {
    alertname.innerHTML = "Invalid name provided!";
    button.disabled = true;
  }
})

email.addEventListener("input", () => {
    if (email.value === "") return alertemail.innerHTML = "";
  if (/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value)) {
    alertemail.innerHTML = "";
    button.disabled = false;
  } else {
    alertemail.innerHTML = "Invalid email provided!";
    button.disabled = true;
  }
})
age.addEventListener("input", () => {
  let ageValue = age.value.trim();
  if (ageValue === "") {
    alertage.innerHTML = "";
    return;
  }

  if (!/^\d+$/.test(ageValue)) {
    alertage.innerHTML = "Invalid age provided! Must be a number.";
    button.disabled = true;
    return;
  }
  let ageNumber = parseInt(ageValue, 10);
  if (ageNumber < 18) {
    alertage.innerHTML = "You must be at least 18 years old.";
    button.disabled = true;
  } else if (ageValue.length > 2) {
    alertage.innerHTML = "Invalid age provided!";
    button.disabled = true;
  } else {
    alertage.innerHTML = "";
    button.disabled = false;
  }
});

eye1.addEventListener("click", () => {
  if (flag1 === 0) {
    password.setAttribute("type", "text");
    eye1.classList.remove("ri-eye-close-line");
    eye1.classList.add("ri-eye-2-line");
    flag1 = 1;
  } else {
    password.setAttribute("type", "password");
    eye1.classList.remove("ri-eye-2-line");
    eye1.classList.add("ri-eye-close-line");
    flag1 = 0;
  }
});
eye2.addEventListener("click", () => {
  if (flag2 === 0) {
    conpass.setAttribute("type", "text");
    eye2.classList.remove("ri-eye-close-line");
    eye2.classList.add("ri-eye-2-line");
    flag2 = 1;
  } else {
    conpass.setAttribute("type", "password");
    eye2.classList.remove("ri-eye-2-line");
    eye2.classList.add("ri-eye-close-line");
    flag2 = 0;
  }
});
});

