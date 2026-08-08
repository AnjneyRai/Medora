# Medora - Healthcare Digital Prescription & Patient Management System

**Medora** is a modern, responsive, role-aware web application for digital prescription management, vitals tracking, and healthcare data security. Built for high performance, smooth UX, and hackathon presentation.

---

## 🌟 Key Features

- **Role-Aware Health Record Access**:
  - **User (Patient)**: Personal active prescriptions, dose checklist, vitals history, refill request engine.
  - **Hospital (Care Team)**: Clinical queue, issue digital prescriptions, log patient vitals.
  - **Authority (Health Board)**: Controlled substance audit queue, facility compliance, epidemic alerts.
  - **Investigator (Research/Audit)**: Anonymized trial cohorts, adverse drug reaction (ADR) reports, cohort exports (JSON).
  - **Reviewer (Insurance/Claims)**: Prior-authorization approval queue, claim verification, diagnostic code audits.
  - **Admin (System)**: Full system access, security audit logs, user registry, database sync settings.

- **Digital Prescription Generator & Printable Engine**:
  - Create multi-medication digital prescriptions with dosage, frequency, and instructions.
  - Printable official prescription sheet with barcode verifier, doctor signature, and diagnostic codes.

- **Interactive Health Vitals & Canvas Charts**:
  - Track BP, pulse, glucose, oxygen saturation (SpO2), and temperature.
  - Native HTML5 Canvas trend visualization without external dependencies.

- **Searchable Medicine Directory**:
  - Comprehensive clinical drug catalog with category filters (Antibiotics, Antidiabetics, Antihypertensives, Controlled).
  - Detailed drug drawer showing side effects, contraindications, and dosage guidelines.

- **Zero-Friction Hybrid Storage**:
  - **LocalStorage Sync Engine**: Fully operational right out of the box with zero external configuration required.
  - **Firebase Integration Ready**: Plug in your Firebase Firestore credentials via the built-in settings modal to enable cloud synchronization.

---

## 📂 Project Structure

```
medora/
├── index.html                # Single Page Application HTML shell
├── styles/
│   ├── main.css              # Design tokens, color palette, dark mode & layout grid
│   └── components.css        # Role switcher, cards, modals, table & printable Rx sheet
├── js/
│   ├── app.js                # App entrypoint & view router
│   ├── roles.js              # Role definitions & RBAC permission matrix
│   ├── store.js              # Data store & LocalStorage engine
│   ├── firebase-config.js    # Firebase v10/v11 SDK integration
│   ├── ui-utils.js           # Toast notifications, modals & canvas charts
│   ├── dashboard.js          # Role-aware dashboard widgets
│   ├── patient.js            # Patient profile & privacy masking engine
│   ├── vitals.js             # Vitals logger & chart binding
│   ├── prescriptions.js      # Digital Rx creator & printable generator
│   ├── medicines.js          # Drug catalog & category search
│   └── audit.js              # Security & regulatory audit logs
└── README.md                 # Deployment & setup documentation
```

---

## 🚀 How to Run Locally

Since Medora uses modern native ES Modules (`import`/`export`), it should be served via a local web server:

### Option 1: Python HTTP Server
```bash
python -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

### Option 2: Node `npx serve`
```bash
npx serve .
```

---

## ☁️ Deployment Instructions

### Deploying to Vercel
1. Push the `medora` directory to your GitHub repository.
2. Go to [Vercel Dashboard](https://vercel.com) -> **Add New Project**.
3. Import your GitHub repository.
4. Set the Framework Preset to **Other** / **Static HTML**.
5. Click **Deploy**!

### Deploying to GitHub Pages
1. Go to repository **Settings** -> **Pages**.
2. Select `main` branch and `/root` directory.
3. Save to publish your live deployment.

---

## 🛡️ License & Hackathon Notes
Medora is built for demo excellence, featuring robust fallback mechanisms, responsive viewports, clean dark/light themes, and instant role switching.
