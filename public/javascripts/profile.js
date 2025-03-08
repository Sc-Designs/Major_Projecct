let userName = document.querySelector("#name");
let wellName = document.querySelector("#wellName");
let profilePic = document.querySelector(".change_photo");
let profilepic = document.querySelector("#profilepic");
let upload = document.querySelector("#upload");

let showName = userName.textContent.split(" ");

wellName.textContent = showName[0];

profilePic.addEventListener("click", ()=>{
    profilepic.click();
})
profilepic.addEventListener("change", ()=>{
    upload.click();
})