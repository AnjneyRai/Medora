// ============================================
// MEDORA VISIT HISTORY JAVASCRIPT
// FIRESTORE VERSION
// ============================================


import { db } from "./firebase-config.js";


import {

collection,

getDocs

} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";





// ==============================
// DOM ELEMENTS
// ==============================


const historyContainer =
document.getElementById("historyContainer");


const searchInput =
document.getElementById("searchHistory");


const visitCount =
document.getElementById("visitCount");


const doctorCount =
document.getElementById("doctorCount");


const medicineCount =
document.getElementById("medicineCount");





let allHistory = [];





// ==============================
// LOAD FIRESTORE DATA
// ==============================


async function loadHistory(){


try{


const snapshot =
await getDocs(
collection(db,"prescriptions")
);



allHistory=[];



snapshot.forEach(doc=>{


const data = doc.data();


allHistory.push(data);



});




// newest first

allHistory.sort(
(a,b)=>

new Date(b.visit_date)
-
new Date(a.visit_date)

);




displayHistory(allHistory);



updateStatistics(allHistory);



}



catch(error){


console.error(
"History loading error:",
error
);



historyContainer.innerHTML=

`

<div class="empty">

<h2>
Unable to load history
</h2>

<p>
Check Firebase connection.
</p>

</div>

`;



}



}






// ==============================
// DISPLAY HISTORY CARDS
// ==============================


function displayHistory(data){



historyContainer.innerHTML="";




if(data.length===0){


historyContainer.innerHTML=

`

<div class="empty">

<h2>
No Prescription History
</h2>

<p>
Your saved prescriptions will appear here.
</p>

</div>

`;


return;


}







data.forEach(item=>{



let medicineHTML="";




if(item.medicines){



item.medicines.forEach(med=>{



medicineHTML +=


`

<div class="medicine-card">


<strong>
${med.name}
</strong>


<div>
${med.strength || ""}
</div>


<div>
${med.duration || ""}
</div>



<div class="schedule">


🌅 ${med.morning ? "✔" : "✖"}

☀ ${med.afternoon ? "✔" : "✖"}

🌙 ${med.night ? "✔" : "✖"}


</div>


</div>


`;



});



}





historyContainer.innerHTML +=



`

<div class="history-card">



<div class="visit-date">

📅 ${item.visit_date || "Date not available"}

</div>





<h2>

👨‍⚕️ ${item.doctor || "Doctor"}

</h2>





<p class="hospital">

🏥 ${item.hospital || "Hospital"}

</p>







<div class="details">



<div class="detail-box">

<span>
Patient
</span>

${item.patient_name || "-"}

</div>




<div class="detail-box">

<span>
Age
</span>

${item.age || "-"}

</div>





<div class="detail-box">

<span>
Blood Group
</span>

${item.blood_group || "-"}

</div>





<div class="detail-box">

<span>
Specialization
</span>

${item.specialization || "-"}

</div>





<div class="detail-box">

<span>
Allergies
</span>

${item.allergies || "None"}

</div>



</div>







<h3 class="medicine-title">

💊 Medicines

</h3>



<div class="medicine-list">

${medicineHTML}

</div>





</div>

`;





});



}









// ==============================
// STATISTICS
// ==============================


function updateStatistics(data){



visitCount.innerText =
data.length;




let doctors =
new Set();



let medicines =
new Set();





data.forEach(item=>{



if(item.doctor){

doctors.add(
item.doctor
);

}




if(item.medicines){


item.medicines.forEach(med=>{


medicines.add(
med.name
);



});


}



});






doctorCount.innerText =
doctors.size;



medicineCount.innerText =
medicines.size;



}








// ==============================
// SEARCH
// ==============================


searchInput.addEventListener(
"input",
()=>{



const value =

searchInput.value
.toLowerCase();





const filtered =

allHistory.filter(item=>{



let medicineNames="";



if(item.medicines){


medicineNames =

item.medicines

.map(m=>m.name)

.join(" ");

}





return (

(item.doctor || "")
.toLowerCase()
.includes(value)



||



(item.hospital || "")
.toLowerCase()
.includes(value)



||



medicineNames
.toLowerCase()
.includes(value)


);



});




displayHistory(filtered);



});







// START

loadHistory();