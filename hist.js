import { db } from "./firebase-config.js";

import {
    collection,
    getDocs,
    query,
    orderBy
}
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const historyContainer = document.getElementById("historyContainer");
const searchInput = document.getElementById("searchInput");

const visitCount = document.getElementById("visitCount");
const doctorCount = document.getElementById("doctorCount");
const medicineCount = document.getElementById("medicineCount");

let allPrescriptions = [];


// ===============================
// LOAD DATA
// ===============================

async function loadHistory(){

    historyContainer.innerHTML = "<p>Loading...</p>";

    try{

        const q = query(
            collection(db,"prescriptions"),
            orderBy("createdAt","desc")
        );

        const snapshot = await getDocs(q);

        allPrescriptions = [];

        snapshot.forEach(doc=>{

            allPrescriptions.push({
                id:doc.id,
                ...doc.data()
            });

        });

        updateStats(allPrescriptions);

        renderCards(allPrescriptions);

    }

    catch(error){

        console.error(error);

        historyContainer.innerHTML=`
        <div class="empty">

            Unable to load visit history.

        </div>
        `;

    }

}


// ===============================
// STATS
// ===============================

function updateStats(data){

    visitCount.innerText=data.length;

    let doctors=new Set();

    let medicines=0;

    data.forEach(item=>{

        if(item.doctor){

            doctors.add(item.doctor);

        }

        if(item.medicines){

            medicines+=item.medicines.length;

        }

    });

    doctorCount.innerText=doctors.size;

    medicineCount.innerText=medicines;

}



// ===============================
// CARD RENDER
// ===============================

function renderCards(data){

    historyContainer.innerHTML="";

    if(data.length===0){

        historyContainer.innerHTML=`
        <div class="empty">

            No prescriptions found.

        </div>
        `;

        return;

    }

    data.forEach(item=>{

        let medicineHTML="";

        item.medicines.forEach(med=>{

            medicineHTML+=`

            <div class="medicine">

                <strong>${med.name}</strong>

                <p>

                    Strength :
                    ${med.strength}

                </p>

                <p>

                    Duration :
                    ${med.duration}

                </p>

                <p>

                    ${med.morning ? "🌅 Morning" : ""}

                    ${med.afternoon ? "☀ Afternoon" : ""}

                    ${med.night ? "🌙 Night" : ""}

                </p>

            </div>

            `;

        });

        historyContainer.innerHTML+=`

        <div class="history-card">

            <h3>

                👨‍⚕️ Dr. ${item.doctor || "Unknown"}

            </h3>

            <h4>

                🏥 ${item.hospital || "-"}

            </h4>

            <p>

                <span class="label">

                    Patient :

                </span>

                ${item.patient_name}

            </p>

            <p>

                <span class="label">

                    Visit Date :

                </span>

                ${item.visit_date}

            </p>

            <p>

                <span class="label">

                    Specialization :

                </span>

                ${item.specialization}

            </p>

            <p>

                <span class="label">

                    Age :

                </span>

                ${item.age}

            </p>

            <p>

                <span class="label">

                    Blood Group :

                </span>

                ${item.blood_group}

            </p>

            <p>

                <span class="label">

                    Allergies :

                </span>

                ${item.allergies || "None"}

            </p>

            <div class="medicine-list">

                ${medicineHTML}

            </div>

        </div>

        `;

    });

}



// ===============================
// SEARCH
// ===============================

searchInput.addEventListener("input",()=>{

    const value=searchInput.value.toLowerCase();

    const filtered=allPrescriptions.filter(item=>{

        const doctor=(item.doctor||"").toLowerCase();

        const hospital=(item.hospital||"").toLowerCase();

        const medicines=item.medicines
        .map(m=>m.name.toLowerCase())
        .join(" ");

        return(

            doctor.includes(value)

            ||

            hospital.includes(value)

            ||

            medicines.includes(value)

        );

    });

    renderCards(filtered);

});


// ===============================
// START
// ===============================

loadHistory();