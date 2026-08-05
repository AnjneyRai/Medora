// ================================
// MEDORA PRESCRIPTION JAVASCRIPT
// ================================


// ================================
// ADD MEDICINE FUNCTION
// ================================


const addMedicineBtn = document.getElementById("addMedicine");

const medicineContainer = document.getElementById("medicineContainer");



addMedicineBtn.addEventListener("click", function(){


    const medicineCard = document.createElement("div");

    medicineCard.classList.add("medicine-card");


    medicineCard.innerHTML = `

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






// ================================
// GENERIC MEDICINE AI SUGGESTION
// ================================


const genericSuggestion =
document.getElementById("genericSuggestion");



const genericDatabase = {


    "crocin":
    "Generic equivalent: Paracetamol",


    "dolo":
    "Generic equivalent: Paracetamol",


    "azithral":
    "Generic equivalent: Azithromycin",


    "augmentin":
    "Generic equivalent: Amoxicillin + Clavulanic Acid",


    "calpol":
    "Generic equivalent: Paracetamol"


};



document.addEventListener("input",function(e){


    if(e.target.classList.contains("medicine-name")){


        let medicine =
        e.target.value.toLowerCase();



        if(genericDatabase[medicine]){


            genericSuggestion.innerHTML =
            "💊 " + genericDatabase[medicine];


        }

        else{


            genericSuggestion.innerHTML =
            "Medora AI suggestions will appear here.";


        }


    }


});








// ================================
// FOOD INTERACTION WARNING
// ================================


const foodWarning =
document.getElementById("foodWarning");



const riskyMedicines=[

    "azithral",
    "augmentin",
    "amoxicillin",
    "ciprofloxacin"

];




document.addEventListener("input",function(e){


    if(e.target.classList.contains("medicine-name")){


        let medicine =
        e.target.value.toLowerCase();



        if(riskyMedicines.includes(medicine)){


            foodWarning.innerHTML =
            "⚠ Avoid alcohol and follow doctor's food instructions.";


        }

        else{


            foodWarning.innerHTML =
            "No warnings detected.";

        }


    }



});







// ================================
// DUPLICATE MEDICINE DETECTION
// ================================


const duplicateCheck =
document.getElementById("duplicateCheck");




function checkDuplicateMedicines(){


    let medicines =
    document.querySelectorAll(".medicine-name");



    let medicineArray=[];



    medicines.forEach(function(item){


        if(item.value.trim()!=""){


            medicineArray.push(
                item.value.toLowerCase()
            );


        }


    });



    let duplicate =
    medicineArray.some(
        (item,index)=>
        medicineArray.indexOf(item)!==index
    );




    if(duplicate){


        duplicateCheck.innerHTML =
        "⚠ Duplicate medicine detected. Please verify.";


    }

    else{


        duplicateCheck.innerHTML =
        "✓ No duplicate medicines found.";


    }



}




document.addEventListener(
"input",
checkDuplicateMedicines
);








// ================================
// AI HEALTH SUMMARY
// ================================



const healthSummary =
document.getElementById("healthSummary");



document.getElementById("savePrescription")
.addEventListener("click",function(){



    let patient =
    document.getElementById("patientName").value;



    let doctor =
    document.getElementById("doctor").value;



    let medicines =
    [...document.querySelectorAll(".medicine-name")]
    .map(m=>m.value)
    .filter(Boolean)
    .join(", ");




    healthSummary.innerHTML = `

    <b>Patient:</b> ${patient || "Not provided"}
    <br><br>

    <b>Consulting Doctor:</b>
    ${doctor || "Not provided"}

    <br><br>

    <b>Prescribed Medicines:</b>
    ${medicines || "No medicines added"}

    <br><br>

    Medora AI has generated this health summary 
    for better doctor consultation.

    `;



});









// ================================
// PDF EXPORT
// ================================



document.getElementById("pdfButton")
.addEventListener("click",function(){



    const summary =
    document.getElementById("healthSummary")
    .innerText;



    const pdfWindow =
    window.open("");



    pdfWindow.document.write(`

    <html>

    <head>

    <title>
    Medora Health Summary
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

// Highlight current page in sidebar

const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll("nav a").forEach(link => {

    if(link.getAttribute("href") === currentPage){

        link.classList.add("active");

    }

});