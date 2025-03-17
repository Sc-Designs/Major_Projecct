let menu = document.querySelector(".menu");
let close = document.querySelector(".close");
let sidemenus = document.querySelector(".sidemenus");
menu.addEventListener("click", () => {
  sidemenus.style.right = "0%";
});
close.addEventListener("click", () => {
  sidemenus.style.right = "-100%";
});