function getMedicineStatus(medicine){

    let today = new Date();

    if(medicine.duration){

        return "🟢 Active";

    }

    return "🟡 Scheduled";

}



function displayMedicines(list){


medicineList.innerHTML="";


if(list.length===0){


medicineList.innerHTML=
`
<p class="empty">
No medicines added yet.
<br>
Add medicines from Prescription or Reminder.
</p>
`;

return;

}



list.forEach((med,index)=>{


let schedule = med.schedule || "Not Scheduled";


medicineList.innerHTML += `


<div class="medicine-card">


<div class="medicine-header">


<h2>
💊 ${med.name}
</h2>


<span class="status">

${getMedicineStatus(med)}

</span>


</div>





<div class="info">


<p>
<strong>Strength:</strong>
${med.strength || "Not specified"}
</p>


<p>
<strong>Duration:</strong>
${med.duration || "Not specified"}
</p>


<p>
<strong>Source:</strong>
${med.source}
</p>


${med.doctor ?

`
<p>
<strong>Doctor:</strong>
${med.doctor}
</p>
`

:""}


</div>






<div class="schedule">


<h4>
⏰ Medicine Schedule
</h4>


<p>
${schedule}
</p>


${med.food ?

`
<p>
🍽 ${med.food}
</p>
`

:""}



${med.frequency ?

`
<p>
🔁 ${med.frequency}
</p>
`

:""}



</div>




<button 
class="delete"
onclick="deleteMedicine(${index})">

Remove Medicine

</button>



</div>


`;


});


}