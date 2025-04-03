let pass = document.querySelector("#password")
let eye1 = document.querySelector(".eye1");
let flag = 0;
eye1.addEventListener("click", () => {
  if (flag === 0) {
    pass.setAttribute("type", "text");
    eye1.classList.remove("ri-eye-close-line");
    eye1.classList.add("ri-eye-2-line");
    flag = 1;
  } else {
    pass.setAttribute("type", "password");
    eye1.classList.remove("ri-eye-2-line");
    eye1.classList.add("ri-eye-close-line");
    flag = 0;
  }
});
