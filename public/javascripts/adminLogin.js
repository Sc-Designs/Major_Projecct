let password = document.querySelector("#password");
let eye1 = document.querySelector(".eye1");
let flag = 0;
eye1.addEventListener("click", () => {
  if (flag === 0) {
    password.setAttribute("type", "text");
    eye1.classList.remove("ri-eye-close-line");
    eye1.classList.add("ri-eye-2-line");
    flag = 1;
  } else {
    password.setAttribute("type", "password");
    eye1.classList.remove("ri-eye-2-line");
    eye1.classList.add("ri-eye-close-line");
    flag = 0;
  }
});