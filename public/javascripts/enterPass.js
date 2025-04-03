let pass = document.querySelector("#password");
let conpass = document.querySelector("#confrimPassword");
let eye1 = document.querySelector(".eye1");
let eye2 = document.querySelector(".eye2");
let error_msg = document.querySelector("p");
let btn = document.querySelector("#btn")
let flag1 = 0;
let flag2 = 0;
conpass.addEventListener("input", ()=> {
    if (conpass.value === "") return error_msg.textContent = "";
    if (pass.value === conpass.value) {
        error_msg.textContent = "";
        btn.disabled = false;
    } else {
        error_msg.textContent = "Conform Password Does not Match";
        btn.disabled = true;
    }
})

eye1.addEventListener("click" , ()=>{
    if(flag1 === 0 ){
        pass.setAttribute("type", "text");
        eye1.classList.remove("ri-eye-close-line");
        eye1.classList.add("ri-eye-2-line");
        flag1 = 1;
    } else {
        pass.setAttribute("type", "password");
        eye1.classList.remove("ri-eye-2-line");
        eye1.classList.add("ri-eye-close-line");
        flag1 = 0;
    }
})
eye2.addEventListener("click" , ()=>{
    if(flag2 === 0 ){
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
})