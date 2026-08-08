// =====================================================
// MEDORA PRESCRIPTION JAVASCRIPT
// AI CONNECTED VERSION
// =====================================================



// =====================================================
// DASHBOARD BUTTON
// =====================================================
import { db } from "./firebase-config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const dashboardBtn = document.querySelector(".dashboard-btn");


if(dashboardBtn){

    dashboardBtn.addEventListener("click",()=>{

        window.location.href="dashboard.html";

    });

}




// =====================================================
// ADD MEDICINE FUNCTION
// =====================================================


const addMedicineBtn =
document.getElementById("addMedicine");


const medicineContainer =
document.getElementById("medicineContainer");



if(addMedicineBtn){


addMedicineBtn.addEventListener("click",()=>{


const medicineCard=document.createElement("div");


medicineCard.classList.add("medicine-card");



medicineCard.innerHTML=`


<div class="form-grid">


<div class="field">

<label>
Medicine Name
</label>

<input 
type="text"
class="medicine-name"
placeholder="Medicine name">

</div>



<div class="field">

<label>
Strength
</label>

<input
type="text"
class="medicine-strength"
placeholder="500mg">

</div>



<div class="field">

<label>
Duration (Days)
</label>

<input
type="number"
class="medicine-duration"
placeholder="5">

</div>


</div>



<div class="timing">


<label>

<input 
type="checkbox"
class="morning">

Morning

</label>


<label>

<input 
type="checkbox"
class="afternoon">

Afternoon

</label>



<label>

<input 
type="checkbox"
class="night">

Night

</label>


</div>


`;


medicineContainer.appendChild(medicineCard);



});

}



// =====================================================
// GENERIC MEDICINE AI SUGGESTION
// =====================================================


const genericDatabase={


"crocin":
"Generic Alternative: Paracetamol",


"dolo":
"Generic Alternative: Paracetamol",


"calpol":
"Generic Alternative: Paracetamol",


"azithral":
"Generic Alternative: Azithromycin",


"augmentin":
"Generic Alternative: Amoxicillin + Clavulanic Acid"


};





document.addEventListener(
"input",
function(e){


if(e.target.classList.contains("medicine-name")){


let medicine =
e.target.value.toLowerCase().trim();



let genericBox =
document.getElementById("genericSuggestion");



if(genericBox){


genericBox.innerHTML =

genericDatabase[medicine]

?
"💊 "+genericDatabase[medicine]

:

"Medora AI suggestions will appear here.";


}



checkFoodInteraction(medicine);

checkDuplicateMedicines();



}



});






// =====================================================
// FOOD INTERACTION WARNING
// =====================================================


function checkFoodInteraction(medicine){


const warningBox =
document.getElementById("foodWarning");


if(!warningBox)
return;



const warnings={


"azithral":
"⚠ Avoid alcohol. Follow doctor's instructions.",


"ciprofloxacin":
"⚠ Avoid dairy products near medication time.",


"warfarin":
"⚠ Maintain consistent Vitamin K intake.",


"augmentin":
"⚠ Prefer taking after meals."


};



warningBox.innerHTML =

warnings[medicine] ||

"✓ No food interaction detected.";



}






// =====================================================
// DUPLICATE MEDICINE DETECTION
// =====================================================


function checkDuplicateMedicines(){


const medicines =

[...document.querySelectorAll(".medicine-name")]

.map(m=>m.value.toLowerCase().trim())

.filter(Boolean);



const duplicateBox =
document.getElementById("duplicateCheck");



if(!duplicateBox)
return;



const duplicate =

medicines.some(

(item,index)=>

medicines.indexOf(item)!==index

);



duplicateBox.innerHTML = duplicate

?

"⚠ Duplicate medicine detected. Verify prescription."

:

"✓ No duplicate medicines found.";



}



document.addEventListener(
"input",
checkDuplicateMedicines
);






// =====================================================
// SAVE PRESCRIPTION + AI BACKEND
// =====================================================


const saveBtn =
document.getElementById("savePrescription");



const healthSummary =
document.getElementById("healthSummary");





if(saveBtn){



saveBtn.addEventListener(
"click",
async()=>{



let medicines=[];



document.querySelectorAll(".medicine-card")

.forEach(card=>{


let name =

card.querySelector(".medicine-name").value.trim();



if(name){


medicines.push({


name:name,


strength:
card.querySelector(".medicine-strength").value,


duration:
card.querySelector(".medicine-duration").value,


morning:
card.querySelector(".morning").checked,


afternoon:
card.querySelector(".afternoon").checked,


night:
card.querySelector(".night").checked



});


}



});





if(medicines.length===0){


alert(
"Please add at least one medicine."
);


return;


}




let prescriptionData={



patient_name:

document.getElementById("patientName").value,


age:

document.getElementById("age").value,


blood_group:

document.getElementById("bloodGroup").value,


allergies:

document.getElementById("allergies").value,


doctor:

document.getElementById("doctor").value,


hospital:

document.getElementById("hospital").value,


visit_date:

document.getElementById("date").value,


specialization:

document.getElementById("specialization").value,


medicines:medicines



};


// SAVE TO FIRESTORE

try {

    await addDoc(collection(db, "prescriptions"), {

        patient_name: prescriptionData.patient_name,

        age: prescriptionData.age,

        blood_group: prescriptionData.blood_group,

        allergies: prescriptionData.allergies,

        doctor: prescriptionData.doctor,

        hospital: prescriptionData.hospital,

        visit_date: prescriptionData.visit_date,

        specialization: prescriptionData.specialization,

        medicines: prescriptionData.medicines,

        createdAt: new Date()

    });

    console.log("Prescription stored in Firestore");

}

catch(error){

    console.error("Firestore Error:", error);

}



// AI LOADING MESSAGE


healthSummary.innerHTML=`

<h3>
🤖 Medora AI is analyzing...
</h3>

<p>
Checking medicine safety, interactions and health recommendations.
</p>

`;






try{


const response = await fetch(
    "https://prescription-page.vercel.app/api/analyze",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(prescriptionData)
    }
);


const result = await response.json();

console.log(JSON.stringify(result, null, 2));

healthSummary.innerHTML = `
<h3>🤖 Medora AI Health Report</h3>

<h4>Clinical Report</h4>
<ul>
${result.report.map(item => `<li>${item}</li>`).join("")}
</ul>

<h4>Recommendations</h4>
<ul>
${result.recommendations.map(item => `<li>${item}</li>`).join("")}
</ul>
`;

alert("Prescription saved successfully!");

}
catch(error){

    console.error(error);

    healthSummary.innerHTML = `
    <p>Unable to generate AI report.</p>
    `;
}

});
}

// =====================================================
// PDF EXPORT
// =====================================================



const pdfBtn =
document.getElementById("pdfButton");



if(pdfBtn){


pdfBtn.addEventListener(
"click",
()=>{


const summary =

healthSummary.innerText;



const pdfWindow =
window.open("");



pdfWindow.document.write(`


<html>

<head>

<title>
Medora AI Health Summary
</title>
</head>
<body>
<h1>
🩺 Medora AI Health Summary
</h1>

<p>

${summary}

</p>
</body>
`);
});

// Highlight current page in sidebar

const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll("nav a").forEach(link => {

    if(link.getAttribute("href") === currentPage){

        link.classList.add("active");

    }

});
}