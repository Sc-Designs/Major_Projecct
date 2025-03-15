const golas = document.querySelectorAll(".golas");
let menu = document.querySelector(".menu");
let close = document.querySelector(".close");
let sidemenus = document.querySelector(".sidemenus");
let colors;
let colorChanger = () => {
  return (color = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
    Math.random() * 255
  )},${Math.floor(Math.random() * 255)})`);
};
let UpdateColor = () => {
  let newColor = colorChanger();
  golas.forEach((item) => {
    item.style.transition = "all 1s ease";
    item.style.backgroundColor = newColor;
  });
};
UpdateColor();
setInterval(UpdateColor, 2000);
menu.addEventListener("click", () => {
  sidemenus.style.right = "0%";
});
close.addEventListener("click", () => {
  sidemenus.style.right = "-100%";
});