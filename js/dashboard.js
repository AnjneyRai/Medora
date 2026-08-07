import { db } from "./firebase-config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const input = document.querySelector(".ai-panel input");
const button = document.querySelector(".ask-btn");
const chat = document.querySelector(".chat-box");

button.addEventListener("click", askAI);

input.addEventListener("keypress", function(e){

    if(e.key==="Enter"){

        askAI();

    }

});

function askAI(){

    const question = input.value.trim();

    if(question==="") return;

    // User message
    chat.innerHTML += `
        <div class="user-message">
            👤 ${question}
        </div>
    `;

    input.value="";

    chat.scrollTop = chat.scrollHeight;

    // AI typing
    chat.innerHTML += `
        <div class="typing" id="typing">
            🤖 Medora is thinking...
        </div>
    `;

    chat.scrollTop = chat.scrollHeight;

    setTimeout(function(){

        document.getElementById("typing").remove();

        chat.innerHTML += `
            <div class="ai-message">
                🤖 This is a demo response. Later I'll answer using AI.
            </div>
        `;

        chat.scrollTop = chat.scrollHeight;

    },1500);

}

// Highlight current page in sidebar

const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll("nav a").forEach(link => {

    if(link.getAttribute("href") === currentPage){

        link.classList.add("active");

    }

});
async function loadDashboard(){

    const snapshot = await getDocs(collection(db,"prescriptions"));

    let totalMedicines = 0;

    let totalVisits = snapshot.size;

    let totalDoses = 0;

    snapshot.forEach(doc=>{

        const data = doc.data();

        totalMedicines += data.medicines.length;

        data.medicines.forEach(med=>{

            if(med.morning) totalDoses++;

            if(med.afternoon) totalDoses++;

            if(med.night) totalDoses++;

        });

    });

    document.getElementById("medicineCount").innerText = totalMedicines;

    document.getElementById("visitCount").innerText = totalVisits;

    document.getElementById("doseCount").innerText = totalDoses;

}

async function loadReminders(){

    const snapshot = await getDocs(collection(db,"prescriptions"));

    let reminders = [];

    snapshot.forEach(doc=>{

        const data = doc.data();

        data.medicines.forEach(med=>{

            if(med.morning){

                reminders.push({
                    time:"🕗 08:00 AM",
                    medicine:med.name,
                    dose:"1 Tablet • After Breakfast"
                });

            }

            if(med.afternoon){

                reminders.push({
                    time:"🕑 02:00 PM",
                    medicine:med.name,
                    dose:"1 Tablet • After Lunch"
                });

            }

            if(med.night){

                reminders.push({
                    time:"🕗 08:00 PM",
                    medicine:med.name,
                    dose:"1 Tablet • Before Sleep"
                });

            }

        });

    });

    if(reminders.length>0){

        document.getElementById("reminder1").innerHTML=`

            <div class="reminder-top">

                <div>

                    <h3>${reminders[0].time}</h3>

                    <p>${reminders[0].medicine}</p>

                </div>

                <span class="status pending">

                    Pending

                </span>

            </div>

            <small>${reminders[0].dose}</small>

        `;

    }

    if(reminders.length>1){

        document.getElementById("reminder2").innerHTML=`

            <div class="reminder-top">

                <div>

                    <h3>${reminders[1].time}</h3>

                    <p>${reminders[1].medicine}</p>

                </div>

                <span class="status pending">

                    Pending

                </span>

            </div>

            <small>${reminders[1].dose}</small>

        `;

    }

}

loadDashboard();
loadReminders();

document
.getElementById("viewAllReminders")
.addEventListener("click",()=>{

    window.location.href="reminders.html";

});