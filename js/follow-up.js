// =====================================================
// MEDORA PATIENT FOLLOW-UP
// FIREBASE FIRESTORE VERSION
// NO AI / NO FLASK
// =====================================================


import { db } from "./firebase-config.js";


import {

    collection,
    getDocs,
    updateDoc,
    doc,
    serverTimestamp

} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


// =====================================================
// ELEMENTS
// =====================================================

const recordsList =
    document.getElementById("recordsList");

const searchRecord =
    document.getElementById("searchRecord");

const recordCount =
    document.getElementById("recordCount");

const scheduledCount =
    document.getElementById("scheduledCount");

const completedCount =
    document.getElementById("completedCount");

const pendingCount =
    document.getElementById("pendingCount");

const notesCount =
    document.getElementById("notesCount");


const selectedPatient =
    document.getElementById("selectedPatient");

const selectedDoctor =
    document.getElementById("selectedDoctor");

const selectedDate =
    document.getElementById("selectedDate");

const selectedHospital =
    document.getElementById("selectedHospital");

const selectedSpecialization =
    document.getElementById("selectedSpecialization");

const selectedMedicines =
    document.getElementById("selectedMedicines");


const currentStatusBadge =
    document.getElementById("currentStatusBadge");


const followUpStatus =
    document.getElementById("followUpStatus");

const followUpDate =
    document.getElementById("followUpDate");

const clinicianName =
    document.getElementById("clinicianName");

const clinicianNote =
    document.getElementById("clinicianNote");

const saveFollowUp =
    document.getElementById("saveFollowUp");

const saveMessage =
    document.getElementById("saveMessage");


const savedStatus =
    document.getElementById("savedStatus");

const savedDate =
    document.getElementById("savedDate");

const savedClinician =
    document.getElementById("savedClinician");

const savedNote =
    document.getElementById("savedNote");


const characterCount =
    document.getElementById("characterCount");


// =====================================================
// DATA
// =====================================================

let records = [];

let selectedRecordId = null;


// =====================================================
// LOAD FIRESTORE RECORDS
// =====================================================

async function loadRecords(){

    try{

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "prescriptions"
                )
            );


        records = [];


        snapshot.forEach(
            recordDoc => {

                const data =
                    recordDoc.data();


                records.push({

                    id:
                        recordDoc.id,

                    ...data

                });

            }
        );


        recordCount.innerText =
            records.length;


        updateOverview();


        displayRecords(records);


        if(records.length > 0){

            selectRecord(
                records[0].id
            );

        }
        else{

            showEmptyState();

        }

    }
    catch(error){

        console.error(
            "Error loading records:",
            error
        );


        recordsList.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <h3>
                    Unable to load health records
                </h3>

                <p>
                    Please check your Firebase connection and Firestore rules.
                </p>

            </div>

        `;

    }

}


// =====================================================
// OVERVIEW COUNTERS
// =====================================================

function updateOverview(){

    let scheduled = 0;

    let completed = 0;

    let pending = 0;

    let notes = 0;


    records.forEach(
        record => {

            const status =
                record.follow_up_status ||
                "Pending Follow-up";


            if(
                status ===
                "Follow-Up Scheduled"
            ){

                scheduled++;

            }


            if(
                status ===
                "Follow-Up Completed"
            ){

                completed++;

            }


            if(
                status ===
                "Pending Follow-up"
            ){

                pending++;

            }


            if(
                record.clinician_note &&
                record.clinician_note.trim() !== ""
            ){

                notes++;

            }

        }
    );


    scheduledCount.innerText =
        scheduled;

    completedCount.innerText =
        completed;

    pendingCount.innerText =
        pending;

    notesCount.innerText =
        notes;

}


// =====================================================
// DISPLAY RECORDS
// =====================================================

function displayRecords(list){

    recordsList.innerHTML = "";


    if(list.length === 0){

        showEmptyState();

        return;

    }


    list.forEach(
        record => {

            const status =
                record.follow_up_status ||
                "Pending Follow-up";


            const statusClass =
                getStatusClass(status);


            const patient =
                record.patient_name ||
                "Unnamed Patient";


            const doctor =
                record.doctor ||
                "Clinician not provided";


            const hospital =
                record.hospital ||
                "Hospital not provided";


            const date =
                record.visit_date ||
                "Date not available";


            const note =
                record.clinician_note ||
                "";


            const card =
                document.createElement("div");


            card.className =
                "record-card";


            if(
                record.id ===
                selectedRecordId
            ){

                card.classList.add(
                    "selected"
                );

            }


            card.innerHTML = `

                <div class="record-card-top">

                    <div class="patient-avatar">

                        <i class="fa-solid fa-user"></i>

                    </div>


                    <span
                        class="status-badge ${statusClass}"
                    >

                        ${status}

                    </span>

                </div>


                <h3>
                    ${escapeHTML(patient)}
                </h3>


                <p>
                    <i class="fa-solid fa-user-doctor"></i>

                    ${escapeHTML(doctor)}
                </p>


                <div class="record-info">

                    <span>
                        <i class="fa-solid fa-hospital"></i>

                        Hospital
                    </span>

                    <strong>
                        ${escapeHTML(hospital)}
                    </strong>

                </div>


                <div class="record-info">

                    <span>
                        <i class="fa-solid fa-calendar"></i>

                        Visit Date
                    </span>

                    <strong>
                        ${escapeHTML(date)}
                    </strong>

                </div>


                <div class="record-info">

                    <span>
                        <i class="fa-solid fa-note-sticky"></i>

                        Clinician Note
                    </span>

                    <strong>

                        ${
                            note
                            ? "Available"
                            : "Not added"
                        }

                    </strong>

                </div>

            `;


            card.addEventListener(
                "click",
                () => {

                    selectRecord(
                        record.id
                    );

                }
            );


            recordsList.appendChild(
                card
            );

        }
    );

}


// =====================================================
// EMPTY STATE
// =====================================================

function showEmptyState(){

    recordsList.innerHTML = `

        <div class="empty-state">

            <i class="fa-solid fa-file-medical"></i>

            <h3>
                No health records yet
            </h3>

            <p>
                Add a prescription first to create a patient health record.
            </p>

        </div>

    `;

}


// =====================================================
// SELECT RECORD
// =====================================================

function selectRecord(id){

    const record =
        records.find(
            item =>
                item.id === id
        );


    if(!record){

        return;

    }


    selectedRecordId =
        id;


    // =============================================
    // PATIENT INFORMATION
    // =============================================

    selectedPatient.innerText =
        record.patient_name ||
        "Unnamed Patient";


    selectedDoctor.innerText =
        record.doctor
        ? `Attending clinician: ${record.doctor}`
        : "Clinician not provided";


    selectedDate.innerText =
        record.visit_date ||
        "Not available";


    selectedHospital.innerText =
        record.hospital ||
        "Not provided";


    selectedSpecialization.innerText =
        record.specialization ||
        "Not provided";


    const medicines =
        Array.isArray(
            record.medicines
        )
        ? record.medicines
        : [];


    selectedMedicines.innerText =
        medicines.length
        ? medicines.length + " prescribed"
        : "None";


    // =============================================
    // FOLLOW-UP DATA
    // =============================================

    followUpStatus.value =
        record.follow_up_status ||
        "Pending Follow-up";


    followUpDate.value =
        record.follow_up_date ||
        "";


    clinicianName.value =
        record.clinician_name ||
        record.doctor ||
        "";


    clinicianNote.value =
        record.clinician_note ||
        "";


    updateCharacterCount();


    updateCurrentStatus(
        record.follow_up_status
    );


    updateSavedUpdate(
        record
    );


    // =============================================
    // UPDATE SELECTED CARD
    // =============================================

    displayRecords(
        getFilteredRecords()
    );

}


// =====================================================
// CURRENT STATUS BADGE
// =====================================================

function updateCurrentStatus(
    status
){

    const actualStatus =
        status ||
        "Pending Follow-up";


    currentStatusBadge.innerText =
        actualStatus;


    currentStatusBadge.className =
        "status-badge " +
        getStatusClass(
            actualStatus
        );

}


// =====================================================
// SAVED UPDATE
// =====================================================

function updateSavedUpdate(
    record
){

    const status =
        record.follow_up_status ||
        "Pending Follow-up";


    savedStatus.innerText =
        status;


    savedDate.innerText =
        record.follow_up_date ||
        "Not scheduled";


    savedClinician.innerText =
        record.clinician_name ||
        record.doctor ||
        "Not provided";


    savedNote.innerText =
        record.clinician_note ||
        "No clinician note added.";

}


// =====================================================
// STATUS CLASS
// =====================================================

function getStatusClass(
    status
){

    switch(status){

        case "Follow-Up Scheduled":

            return "scheduled";


        case "Follow-Up Completed":

            return "completed";


        case "No Follow-Up Required":

            return "not-required";


        default:

            return "pending";

    }

}


// =====================================================
// SAVE FOLLOW-UP
// =====================================================

saveFollowUp.addEventListener(
    "click",
    async function(){

        if(!selectedRecordId){

            showMessage(
                "Please select a health record first.",
                "error"
            );

            return;

        }


        const status =
            followUpStatus.value;


        const date =
            followUpDate.value;


        const clinician =
            clinicianName.value.trim();


        const note =
            clinicianNote.value.trim();


        if(!status){

            showMessage(
                "Please select a follow-up status.",
                "error"
            );

            return;

        }


        saveFollowUp.disabled =
            true;


        saveFollowUp.innerHTML = `

            <i class="fa-solid fa-spinner fa-spin"></i>

            Saving...

        `;


        try{

            const recordRef =
                doc(
                    db,
                    "prescriptions",
                    selectedRecordId
                );


            await updateDoc(
                recordRef,
                {

                    follow_up_status:
                        status,

                    follow_up_date:
                        date,

                    clinician_name:
                        clinician,

                    clinician_note:
                        note,

                    follow_up_updated_at:
                        serverTimestamp()

                }
            );


            // =====================================
            // UPDATE LOCAL RECORD
            // =====================================

            const recordIndex =
                records.findIndex(
                    record =>
                        record.id ===
                        selectedRecordId
                );


            if(recordIndex !== -1){

                records[
                    recordIndex
                ].follow_up_status =
                    status;


                records[
                    recordIndex
                ].follow_up_date =
                    date;


                records[
                    recordIndex
                ].clinician_name =
                    clinician;


                records[
                    recordIndex
                ].clinician_note =
                    note;

            }


            updateOverview();


            updateCurrentStatus(
                status
            );


            updateSavedUpdate({

                follow_up_status:
                    status,

                follow_up_date:
                    date,

                clinician_name:
                    clinician,

                clinician_note:
                    note,

                doctor:
                    clinician

            });


            displayRecords(
                getFilteredRecords()
            );


            showMessage(
                "✓ Follow-up information saved successfully.",
                "success"
            );

        }
        catch(error){

            console.error(
                "Follow-up save error:",
                error
            );


            showMessage(
                "Unable to save follow-up. Check Firestore permissions.",
                "error"
            );

        }


        saveFollowUp.disabled =
            false;


        saveFollowUp.innerHTML = `

            <i class="fa-solid fa-floppy-disk"></i>

            Save Follow-Up

        `;

    }
);


// =====================================================
// SEARCH
// =====================================================

searchRecord.addEventListener(
    "input",
    function(){

        displayRecords(
            getFilteredRecords()
        );

    }
);


function getFilteredRecords(){

    const value =
        searchRecord.value
            .toLowerCase()
            .trim();


    if(!value){

        return records;

    }


    return records.filter(
        record => {

            const patient =
                record.patient_name ||
                "";

            const doctor =
                record.doctor ||
                "";

            const hospital =
                record.hospital ||
                "";

            const status =
                record.follow_up_status ||
                "";


            return (

                patient
                    .toLowerCase()
                    .includes(value)

                ||

                doctor
                    .toLowerCase()
                    .includes(value)

                ||

                hospital
                    .toLowerCase()
                    .includes(value)

                ||

                status
                    .toLowerCase()
                    .includes(value)

            );

        }
    );

}


// =====================================================
// CHARACTER COUNTER
// =====================================================

clinicianNote.addEventListener(
    "input",
    updateCharacterCount
);


function updateCharacterCount(){

    characterCount.innerText =
        clinicianNote.value.length;

}


// =====================================================
// MESSAGE
// =====================================================

function showMessage(
    message,
    type
){

    saveMessage.innerText =
        message;


    saveMessage.className =
        "save-message " +
        type;


    setTimeout(
        () => {

            saveMessage.innerText = "";

        },
        4000
    );

}


// =====================================================
// HTML ESCAPE
// Prevents user-entered text from becoming HTML
// =====================================================

function escapeHTML(
    value
){

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// =====================================================
// START
// =====================================================

loadRecords();