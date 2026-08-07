import { db } from "./firebase-config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const medicine = document.getElementById("medicine");
const dosage = document.getElementById("dosage");
const time = document.getElementById("time");
const frequency = document.getElementById("frequency");
const food = document.getElementById("food");
const addBtn = document.getElementById("addReminder");
const reminderList = document.getElementById("reminderList");
const nextTime = document.getElementById("nextTime");
const nextMedicine = document.getElementById("nextMedicine");

let reminders = JSON.parse(localStorage.getItem("medoraReminders")) || [];

function saveReminders() {
    localStorage.setItem("medoraReminders", JSON.stringify(reminders));
}

function updateNextDose() {
    if (reminders.length === 0) {
        nextTime.textContent = "--:--";
        nextMedicine.textContent = "No Upcoming Medicine";
        return;
    }

    reminders.sort((a, b) => a.time.localeCompare(b.time));

    nextTime.textContent = reminders[0].time;
    nextMedicine.textContent = reminders[0].medicine;
}

function displayReminders() {

    reminderList.innerHTML = "";

    if (reminders.length === 0) {
        reminderList.innerHTML =
        "<p style='text-align:center;color:gray;'>No reminders added.</p>";

        updateNextDose();
        return;
    }

    reminders.forEach((item, index) => {

        const card = document.createElement("div");
        card.className = "upcoming";

        card.innerHTML = `
        <div>
            <h3>${item.medicine}</h3>
            <p>${item.time} • ${item.dosage}</p>
            <small>${item.food}</small>
        </div>

        <div style="text-align:right;">
            <span class="badge">${item.frequency}</span>
            <br><br>

            <button class="deleteBtn" onclick="deleteReminder(${index})">
            Delete
            </button>
        </div>
        `;

        reminderList.appendChild(card);

    });

    updateNextDose();
}

function deleteReminder(index) {

    if(confirm("Delete this reminder?")){

        reminders.splice(index,1);

        saveReminders();

        displayReminders();
    }

}

addBtn.addEventListener("click",()=>{

    if(
        medicine.value.trim()==="" ||
        dosage.value.trim()==="" ||
        time.value===""){

        alert("Please fill all fields.");
        return;
    }

    reminders.push({

        medicine:medicine.value.trim(),

        dosage:dosage.value.trim(),

        time:time.value,

        frequency:frequency.value,

        food:food.value

    });

    saveReminders();

    displayReminders();

    medicine.value="";
    dosage.value="";
    time.value="";
    frequency.selectedIndex=0;
    food.selectedIndex=0;

});

async function loadReminders(){

    const snapshot = await getDocs(collection(db,"prescriptions"));

    let reminders = [];

    snapshot.forEach(doc=>{

        const data = doc.data();

        data.medicines.forEach(med=>{

            if(med.morning){

                reminders.push({
                    time:"08:00 AM",
                    meal:"After Breakfast",
                    medicine:med.name
                });

            }

            if(med.afternoon){

                reminders.push({
                    time:"02:00 PM",
                    meal:"After Lunch",
                    medicine:med.name
                });

            }

            if(med.night){

                reminders.push({
                    time:"08:00 PM",
                    meal:"Before Sleep",
                    medicine:med.name
                });

            }

        });

    });

    reminders.sort((a,b)=>a.time.localeCompare(b.time));

    const todayList=document.getElementById("todayList");

    todayList.innerHTML="";

    reminders.forEach(rem=>{

        todayList.innerHTML += `

        <div class="schedule">

            <div class="time blue">

                ${rem.time.replace(" ","<br>")}

            </div>

            <div class="details">

                <h3>${rem.medicine}</h3>

                <p>${rem.meal}</p>

            </div>

            <span class="pending">

                Pending

            </span>

        </div>

        `;

    });

    if(reminders.length>0){

        document.getElementById("nextTime").innerText=
            reminders[0].time;

        document.getElementById("nextMedicine").innerText=
            reminders[0].medicine;

    }

}
loadReminders();
displayReminders();
