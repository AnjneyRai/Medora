// =====================================
// MEDORA MEDICINE REMINDER JAVASCRIPT
// =====================================


const reminderForm = document.getElementById("reminderForm");

const scheduleSection = document.querySelector(".schedule");



let reminders = JSON.parse(
    localStorage.getItem("medoraReminders")
) || [];




// SAVE REMINDER

reminderForm.addEventListener("submit", function(e){

    e.preventDefault();



    const reminder = {


        id: Date.now(),


        medicine:
        document.getElementById("medicineName").value,


        dosage:
        document.getElementById("dosage").value,


        time:
        document.getElementById("time").value,


        frequency:
        document.getElementById("frequency").value,


        food:
        document.getElementById("food").value,


        taken:false


    };



    reminders.push(reminder);



    saveData();


    displayReminders();



    reminderForm.reset();



});






// SAVE TO LOCAL STORAGE

function saveData(){

    localStorage.setItem(
        "medoraReminders",
        JSON.stringify(reminders)
    );

}






// DISPLAY REMINDERS

function displayReminders(){


    const oldCards =
    document.querySelectorAll(".dynamic-card");


    oldCards.forEach(card=>{
        card.remove();
    });




    reminders.forEach(reminder=>{


        const card=document.createElement("div");


        card.className=
        "medicine-card dynamic-card";



        card.innerHTML=`

        <div class="time">

            ${reminder.time}

        </div>



        <div class="medicine-info">

            <h3>
                ${reminder.medicine}
            </h3>


            <p>
                ${reminder.dosage}
            </p>


            <p>
                ${reminder.food}
            </p>


        </div>



        <button 
        class="${reminder.taken ? "taken":"pending"}"
        onclick="toggleTaken(${reminder.id})">

        ${reminder.taken ? "Taken":"Pending"}

        </button>



        <button 
        class="delete-btn"
        onclick="deleteReminder(${reminder.id})">

        Delete

        </button>


        `;



        scheduleSection.appendChild(card);



    });


}






// MARK AS TAKEN

function toggleTaken(id){


    reminders =
    reminders.map(rem=>{


        if(rem.id===id){

            rem.taken =
            !rem.taken;

        }


        return rem;


    });



    saveData();

    displayReminders();


}






// DELETE REMINDER


function deleteReminder(id){


    reminders =
    reminders.filter(
        rem=>rem.id!==id
    );


    saveData();

    displayReminders();


}






// INITIAL LOAD

displayReminders();
