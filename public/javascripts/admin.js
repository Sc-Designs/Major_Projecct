let menu = document.querySelector(".menu");
let close = document.querySelector(".close");
let sidemenus = document.querySelector(".sidemenus");
let btn = document.querySelector(".changes");
let file = document.querySelector("#adminPic");
let upload = document.querySelector("#upload");
menu.addEventListener("click", () => {
  sidemenus.style.right = "0%";
});
close.addEventListener("click", () => {
  sidemenus.style.right = "-100%";
});
btn.addEventListener("click", ()=>{
  file.click();
})
file.addEventListener("change", ()=>{
  upload.click();
})