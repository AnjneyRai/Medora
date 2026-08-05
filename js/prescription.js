// =====================================================
// MEDORA PRESCRIPTION JAVASCRIPT
// AI CONNECTED VERSION
// =====================================================



// =====================================================
// DASHBOARD BUTTON
// =====================================================

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

"http://127.0.0.1:5000/save_prescription",

{


method:"POST",


headers:{

"Content-Type":"application/json"

},


body:

JSON.stringify(prescriptionData)



}

);




const result =
await response.json();





// DISPLAY REAL AI RESPONSE


healthSummary.innerHTML=`


<h3>
🤖 Medora AI Health Report
</h3>


<hr>


<p>

${result.summary.replace(/\n/g,"<br>")}

</p>



`;



alert(
"Prescription saved successfully!"
);



}



catch(error){


console.error(error);



healthSummary.innerHTML=`

<h3>
❌ AI Connection Failed
</h3>

<p>
Please make sure Flask server is running.
</p>

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


</html>


`);



pdfWindow.print();



});


}
