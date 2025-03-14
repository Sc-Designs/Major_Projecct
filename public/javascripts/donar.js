const golas = document.querySelectorAll(".golas");
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
