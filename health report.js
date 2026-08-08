// =====================================================
// MEDORA HEALTH REPORT
// DIRECT FIRESTORE VERSION
// =====================================================


import { db } from "./firebase-config.js";


import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


// =====================================================
// ELEMENTS
// =====================================================

const recordSelect =
    document.getElementById("recordSelect");

const status =
    document.getElementById("status");

const report =
    document.getElementById("report");

const refreshBtn =
    document.getElementById("refreshBtn");

const downloadBtn =
    document.getElementById("downloadBtn");


let records = [];

let selectedRecord = null;


// =====================================================
// LOAD FIRESTORE RECORDS
// =====================================================

async function loadRecords() {

    status.textContent =
        "Connecting to Medora database...";


    recordSelect.innerHTML = `
        <option value="">
            Loading records...
        </option>
    `;


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "prescriptions"
                )
            );


        records = [];


        snapshot.forEach(
            document => {

                records.push({

                    id: document.id,

                    ...document.data()

                });

            }
        );


        recordSelect.innerHTML = `
            <option value="">
                Select a health record
            </option>
        `;


        if (records.length === 0) {

            status.textContent =
                "No health records found in Firestore.";

            return;

        }


        records.forEach(
            record => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    record.id;


                const patient =
                    record.patient_name ||
                    "Unknown Patient";


                const date =
                    record.visit_date ||
                    "No date";


                option.textContent =
                    `${patient} — ${date}`;


                recordSelect.appendChild(
                    option
                );

            }
        );


        status.textContent =
            `${records.length} health record(s) loaded from Firestore.`;

    }


    catch (error) {

        console.error(
            "Firestore Error:",
            error
        );


        status.textContent =
            "❌ Could not connect to Firestore.";


        recordSelect.innerHTML = `
            <option value="">
                Error loading records
            </option>
        `;

    }

}


// =====================================================
// DISPLAY RECORD
// =====================================================

function displayRecord(record) {

    if (!record) {

        report.classList.add(
            "hidden"
        );

        return;

    }


    selectedRecord = record;


    report.classList.remove(
        "hidden"
    );


    document.getElementById(
        "patientName"
    ).textContent =
        record.patient_name ||
        "Not provided";


    document.getElementById(
        "age"
    ).textContent =
        record.age ||
        "Not provided";


    document.getElementById(
        "bloodGroup"
    ).textContent =
        record.blood_group ||
        "Not provided";


    document.getElementById(
        "allergies"
    ).textContent =
        record.allergies ||
        "None reported";


    document.getElementById(
        "doctor"
    ).textContent =
        record.doctor ||
        "Not provided";


    document.getElementById(
        "hospital"
    ).textContent =
        record.hospital ||
        "Not provided";


    document.getElementById(
        "specialization"
    ).textContent =
        record.specialization ||
        "Not provided";


    document.getElementById(
        "visitDate"
    ).textContent =
        record.visit_date ||
        "Not provided";


    document.getElementById(
        "generatedDate"
    ).textContent =
        new Date()
            .toLocaleDateString();


    const table =
        document.getElementById(
            "medicineTable"
        );


    table.innerHTML = "";


    const medicines =
        record.medicines || [];


    if (medicines.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    No medication information found.
                </td>
            </tr>
        `;

    }


    medicines.forEach(
        medicine => {

            const row =
                document.createElement(
                    "tr"
                );


            const timings = [];


            if (medicine.morning) {

                timings.push(
                    "Morning"
                );

            }


            if (medicine.afternoon) {

                timings.push(
                    "Afternoon"
                );

            }


            if (medicine.night) {

                timings.push(
                    "Night"
                );

            }


            const timingText =
                timings.length
                    ? timings.join(", ")
                    : "Not specified";


            row.innerHTML = `

                <td>
                    ${escapeHTML(
                medicine.name ||
                "Unknown"
            )}
                </td>

                <td>
                    ${escapeHTML(
                medicine.strength ||
                "Not specified"
            )}
                </td>

                <td>
                    ${escapeHTML(
                timingText
            )}
                </td>

                <td>
                    ${escapeHTML(
                medicine.duration ||
                "Not specified"
            )}
                </td>

                <td>

                    <span class="status-badge">
                        Active
                    </span>

                </td>

            `;


            table.appendChild(
                row
            );

        }
    );


    const notes =
        document.getElementById(
            "healthNotes"
        );


    if (
        record.allergies &&
        record.allergies
            .trim()
            .toLowerCase() !== "none"
    ) {

        notes.textContent =
            `Recorded allergy information: ${record.allergies}.`;

    }

    else {

        notes.textContent =
            "No additional health notes were recorded with this prescription.";

    }

}


// =====================================================
// SECURITY
// =====================================================

function escapeHTML(value) {

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
// SELECT RECORD
// =====================================================

recordSelect.addEventListener(
    "change",
    () => {

        const id =
            recordSelect.value;


        if (!id) {

            selectedRecord = null;

            report.classList.add(
                "hidden"
            );

            return;

        }


        const record =
            records.find(
                item =>
                    item.id === id
            );


        displayRecord(
            record
        );

    }
);


// =====================================================
// REFRESH
// =====================================================

refreshBtn.addEventListener(
    "click",
    loadRecords
);


// =====================================================
// PDF
// =====================================================

downloadBtn.addEventListener(
    "click",
    async () => {

        if (!selectedRecord) {

            alert(
                "Please select a health record first."
            );

            return;

        }


        try {

            if (!window.jspdf) {

                await new Promise(
                    (resolve, reject) => {

                        const script =
                            document.createElement(
                                "script"
                            );


                        script.src =
                            "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";


                        script.onload =
                            resolve;


                        script.onerror =
                            reject;


                        document.head.appendChild(
                            script
                        );

                    }
                );

            }


            const {
                jsPDF
            } =
                window.jspdf;


            const pdf =
                new jsPDF();


            const width =
                pdf.internal.pageSize
                    .getWidth();


            const height =
                pdf.internal.pageSize
                    .getHeight();


            const margin = 20;

            let y = 20;


            // HEADER

            pdf.setFont(
                "helvetica",
                "bold"
            );

            pdf.setFontSize(25);

            pdf.setTextColor(
                37,
                99,
                235
            );


            pdf.text(
                "MEDORA",
                margin,
                y
            );


            y += 7;


            pdf.setFont(
                "helvetica",
                "normal"
            );

            pdf.setFontSize(9);

            pdf.setTextColor(
                100,
                116,
                139
            );


            pdf.text(
                "Personal Health Management",
                margin,
                y
            );


            y += 8;


            pdf.setDrawColor(
                37,
                99,
                235
            );


            pdf.line(
                margin,
                y,
                width - margin,
                y
            );


            y += 15;


            // TITLE

            pdf.setFont(
                "helvetica",
                "bold"
            );

            pdf.setFontSize(18);

            pdf.setTextColor(
                30,
                41,
                59
            );


            pdf.text(
                "Health Record Report",
                margin,
                y
            );


            y += 6;


            pdf.setFont(
                "helvetica",
                "normal"
            );

            pdf.setFontSize(9);

            pdf.setTextColor(
                100,
                116,
                139
            );


            pdf.text(
                `Generated: ${new Date().toLocaleDateString()}`,
                margin,
                y
            );


            // SECTION HELPER

            function section(title) {

                y += 15;


                pdf.setFont(
                    "helvetica",
                    "bold"
                );

                pdf.setFontSize(13);

                pdf.setTextColor(
                    37,
                    99,
                    235
                );


                pdf.text(
                    title,
                    margin,
                    y
                );


                y += 8;

            }


            // PATIENT

            section(
                "Patient Information"
            );


            pdf.setFont(
                "helvetica",
                "normal"
            );

            pdf.setFontSize(10);

            pdf.setTextColor(
                30,
                41,
                59
            );


            pdf.text(
                `Patient Name: ${selectedRecord.patient_name || "Not provided"}`,
                margin,
                y
            );


            pdf.text(
                `Age: ${selectedRecord.age || "Not provided"}`,
                110,
                y
            );


            y += 7;


            pdf.text(
                `Blood Group: ${selectedRecord.blood_group || "Not provided"}`,
                margin,
                y
            );


            pdf.text(
                `Allergies: ${selectedRecord.allergies || "None reported"}`,
                110,
                y
            );


            // PRESCRIPTION

            section(
                "Prescription Details"
            );


            pdf.text(
                `Doctor: ${selectedRecord.doctor || "Not provided"}`,
                margin,
                y
            );


            y += 7;


            pdf.text(
                `Hospital: ${selectedRecord.hospital || "Not provided"}`,
                margin,
                y
            );


            y += 7;


            pdf.text(
                `Specialization: ${selectedRecord.specialization || "Not provided"}`,
                margin,
                y
            );


            y += 7;


            pdf.text(
                `Visit Date: ${selectedRecord.visit_date || "Not provided"}`,
                margin,
                y
            );


            // MEDICINES

            section(
                "Medication Details"
            );


            const medicines =
                selectedRecord.medicines || [];


            medicines.forEach(
                (medicine, index) => {

                    const timings = [];


                    if (medicine.morning)
                        timings.push("Morning");


                    if (medicine.afternoon)
                        timings.push("Afternoon");


                    if (medicine.night)
                        timings.push("Night");


                    const line =
                        `${index + 1}. ${medicine.name || "Unknown"} | ` +
                        `${medicine.strength || "N/A"} | ` +
                        `${timings.join(", ") || "Not specified"} | ` +
                        `${medicine.duration || "N/A"}`;


                    const lines =
                        pdf.splitTextToSize(
                            line,
                            width - margin * 2
                        );


                    pdf.text(
                        lines,
                        margin,
                        y
                    );


                    y +=
                        7 * lines.length;


                    if (
                        y >
                        height - 30
                    ) {

                        pdf.addPage();

                        y = 20;

                    }

                }
            );


            // NOTES

            section(
                "Health Notes"
            );


            const note =
                selectedRecord.allergies &&
                    selectedRecord.allergies
                        .trim()
                        .toLowerCase() !== "none"

                    ? `Recorded allergy information: ${selectedRecord.allergies}.`

                    : "No additional health notes were recorded with this prescription.";


            const noteLines =
                pdf.splitTextToSize(
                    note,
                    width - margin * 2
                );


            pdf.setFont(
                "helvetica",
                "normal"
            );

            pdf.setFontSize(10);

            pdf.setTextColor(
                71,
                85,
                105
            );


            pdf.text(
                noteLines,
                margin,
                y
            );


            // FOOTER

            pdf.setFontSize(8);

            pdf.setTextColor(
                148,
                163,
                184
            );


            pdf.text(
                "Generated by Medora",
                margin,
                height - 12
            );


            // DOWNLOAD

            const patientName =
                (
                    selectedRecord.patient_name ||
                    "Patient"
                ).replace(
                    /[^a-z0-9]/gi,
                    "_"
                );


            pdf.save(
                `Medora Health Report ${patientName}.pdf`
            );

        }


        catch (error) {

            console.error(
                "PDF Error:",
                error
            );


            alert(
                "Could not generate PDF."
            );

        }

    }
);


// =====================================================
// START
// =====================================================

loadRecords();