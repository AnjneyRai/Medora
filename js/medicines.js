import { db } from "./firebase-config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const medicineList = document.getElementById("medicineList");
const medicineCount = document.getElementById("medicineCount");
const searchInput = document.getElementById("searchMedicine");
const aiInsight = document.getElementById("aiInsight");

let allMedicines = [];

function getMedicineStatus(medicine){

    if(medicine.duration){
        return "🟢 Active";
    }

    return "🟡 Scheduled";

}

async function loadMedicines(){

    const snapshot = await getDocs(collection(db,"prescriptions"));

    allMedicines = [];

    snapshot.forEach(doc=>{

        const data = doc.data();

        data.medicines.forEach(med=>{

            allMedicines.push({

                name: med.name,

                strength: med.strength,

                duration: med.duration,

                morning: med.morning,

                afternoon: med.afternoon,

                night: med.night,

                doctor: data.doctor,

                hospital: data.hospital

            });

        });

    });

    medicineCount.innerHTML =
        `💊 Total Medicines : <strong>${allMedicines.length}</strong>`;

    aiInsight.innerHTML =
        `You currently have <strong>${allMedicines.length}</strong> medicines stored in Medora.`;

    displayMedicines(allMedicines);

}

function displayMedicines(list){

    medicineList.innerHTML="";

    if(list.length===0){

        medicineList.innerHTML="<h3>No medicines found.</h3>";

        return;

    }

    list.forEach(med=>{

        medicineList.innerHTML += `

        <div class="medicine-card">

            <h3>${med.name}</h3>

            <p><b>Strength:</b> ${med.strength}</p>

            <p><b>Duration:</b> ${med.duration}</p>

            <p><b>Doctor:</b> ${med.doctor}</p>

            <p>

                🌅 ${med.morning ? "✔" : "✖"}

                ☀ ${med.afternoon ? "✔" : "✖"}

                🌙 ${med.night ? "✔" : "✖"}

            </p>

            <p>${getMedicineStatus(med)}</p>

        </div>

        `;

    });

}

searchInput.addEventListener("input",()=>{

    const value = searchInput.value.toLowerCase();

    const filtered = allMedicines.filter(med=>

        med.name.toLowerCase().includes(value)

    );

    displayMedicines(filtered);

});

loadMedicines();