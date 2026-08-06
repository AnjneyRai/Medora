// MEDORA SETTINGS JAVASCRIPT


const logout = document.querySelector(".logout");


logout.addEventListener("click",()=>{


let confirmLogout = confirm(
"Are you sure you want to logout?"
);


if(confirmLogout){

alert("Logged out successfully");

window.location.href="login.html";

}


});





// Toggle settings storage


const switches=document.querySelectorAll(
".switch input"
);



switches.forEach((item,index)=>{


item.addEventListener(
"change",
()=>{


if(item.checked){

console.log(
"Setting enabled:",
index
);

}

else{

console.log(
"Setting disabled:",
index
);

}


});


});