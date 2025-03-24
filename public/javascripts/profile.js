let userName = document.querySelector("#name");
let wellName = document.querySelector("#wellName");
let profilePic = document.querySelector(".change_photo");
let profilepic = document.querySelector("#profilepic");
let upload = document.querySelector("#upload");
let menu = document.querySelector(".menu");
let close = document.querySelector(".close");
let sidemenus = document.querySelector(".sidemenus");
let closer = document.querySelector(".closer");
let addRequest = document.querySelector(".add_request");
let requestFrom = document.querySelector(".request_Form");
let number = document.querySelector("#number");
let selections = document.querySelector("#blood_group");

let showName = userName.textContent.split(" ");

wellName.textContent = showName[0];

profilePic.addEventListener("click", ()=>{
    profilepic.click();
})
profilepic.addEventListener("change", ()=>{
    upload.click();
})
menu.addEventListener("click", ()=>{
    sidemenus.style.right = "0%";
})
close.addEventListener("click", ()=>{
    sidemenus.style.right = "-100%";
})

addRequest.addEventListener("click", ()=>{
    requestFrom.style.opacity = 1;
    requestFrom.style.pointerEvents = "all";
})
closer.addEventListener("click", ()=>{
    requestFrom.style.opacity = 0;
    requestFrom.style.pointerEvents = "none";
    number.value = "";
    selections.selectedIndex = 0;
})
