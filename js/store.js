/**
 * Medora - Central Data Store & LocalStorage / Firebase Sync Layer
 */

import { ROLES } from './roles.js';

const INITIAL_PATIENT = {
  id: 'PT-89421',
  name: 'Eleanor Vance',
  age: 34,
  gender: 'Female',
  bloodGroup: 'O+',
  email: 'eleanor.vance@medora.health',
  phone: '+1 (555) 234-5678',
  address: '742 Evergreen Terrace, Springfield',
  allergies: [
    { name: 'Penicillin', severity: 'Severe' },
    { name: 'Peanuts', severity: 'Moderate' }
  ],
  emergencyContact: {
    name: 'Thomas Vance',
    relation: 'Spouse',
    phone: '+1 (555) 987-6543'
  },
  insurance: {
    provider: 'Apex Health Guard',
    policyNumber: 'HG-9902-881',
    status: 'Verified Active'
  },
  primaryDoctor: 'Dr. Marcus Vance, MD'
};

const INITIAL_PRESCRIPTIONS = [
  {
    id: 'RX-2026-901',
    rxNumber: 'RX901842',
    patientId: 'PT-89421',
    patientName: 'Eleanor Vance',
    anonymizedId: 'COHORT-A-091',
    doctorName: 'Dr. Marcus Vance, MD',
    hospital: 'Springfield Central Hospital',
    date: '2026-08-01',
    diagnosis: 'Type 2 Diabetes Mellitus & Essential Hypertension',
    status: 'active',
    controlledSubstance: false,
    priorAuthStatus: 'approved',
    items: [
      { drug: 'Metformin Hydrochloride', dosage: '500 mg', frequency: 'Twice daily', duration: '90 days', instructions: 'Take with meals' },
      { drug: 'Lisinopril', dosage: '10 mg', frequency: 'Once daily (Morning)', duration: '90 days', instructions: 'Take on empty stomach' }
    ],
    refillsRemaining: 2,
    totalRefillsAllowed: 3,
    lastRefillDate: '2026-08-01'
  },
  {
    id: 'RX-2026-902',
    rxNumber: 'RX902118',
    patientId: 'PT-89421',
    patientName: 'Eleanor Vance',
    anonymizedId: 'COHORT-A-091',
    doctorName: 'Dr. Sarah Lin, MD',
    hospital: 'St. Jude Clinical Care Center',
    date: '2026-08-05',
    diagnosis: 'Acute Bacterial Sinusitis',
    status: 'active',
    controlledSubstance: false,
    priorAuthStatus: 'pending',
    items: [
      { drug: 'Amoxicillin / Clavulanate', dosage: '875 mg', frequency: 'Every 12 hours', duration: '10 days', instructions: 'Finish full course' }
    ],
    refillsRemaining: 0,
    totalRefillsAllowed: 0,
    lastRefillDate: '2026-08-05'
  },
  {
    id: 'RX-2026-903',
    rxNumber: 'RX903442',
    patientId: 'PT-41092',
    patientName: 'Robert Langdon',
    anonymizedId: 'COHORT-B-441',
    doctorName: 'Dr. Marcus Vance, MD',
    hospital: 'Springfield Central Hospital',
    date: '2026-08-06',
    diagnosis: 'Severe Post-Surgical Pain',
    status: 'flagged_audit',
    controlledSubstance: true,
    priorAuthStatus: 'under_review',
    items: [
      { drug: 'Alprazolam', dosage: '0.5 mg', frequency: 'As needed for acute distress', duration: '14 days', instructions: 'Strict schedule. Controlled drug.' },
      { drug: 'Morphine Sulfate', dosage: '10 mg', frequency: 'Every 8 hours', duration: '5 days', instructions: 'Hospital supervised use' }
    ],
    refillsRemaining: 0,
    totalRefillsAllowed: 0,
    lastRefillDate: '2026-08-06'
  },
  {
    id: 'RX-2026-904',
    rxNumber: 'RX904882',
    patientId: 'PT-33019',
    patientName: 'Clara Oswald',
    anonymizedId: 'COHORT-C-109',
    doctorName: 'Dr. James Wilson, MD',
    hospital: 'Metropolitan General Hospital',
    date: '2026-07-20',
    diagnosis: 'Hypercholesterolemia',
    status: 'refill_requested',
    controlledSubstance: false,
    priorAuthStatus: 'approved',
    items: [
      { drug: 'Atorvastatin', dosage: '20 mg', frequency: 'Once daily at bedtime', duration: '30 days', instructions: 'Avoid grapefruit juice' }
    ],
    refillsRemaining: 1,
    totalRefillsAllowed: 3,
    lastRefillDate: '2026-07-20'
  }
];

const INITIAL_VITALS = [
  { id: 'V-101', date: '2026-08-08T08:30', bpSystolic: 120, bpDiastolic: 80, heartRate: 72, bloodSugar: 105, spo2: 98, temp: 98.6 },
  { id: 'V-102', date: '2026-08-07T08:30', bpSystolic: 124, bpDiastolic: 82, heartRate: 75, bloodSugar: 112, spo2: 97, temp: 98.4 },
  { id: 'V-103', date: '2026-08-06T08:30', bpSystolic: 118, bpDiastolic: 78, heartRate: 70, bloodSugar: 99, spo2: 99, temp: 98.6 },
  { id: 'V-104', date: '2026-08-05T08:30', bpSystolic: 128, bpDiastolic: 84, heartRate: 78, bloodSugar: 120, spo2: 98, temp: 99.0 },
  { id: 'V-105', date: '2026-08-04T08:30', bpSystolic: 122, bpDiastolic: 80, heartRate: 73, bloodSugar: 108, spo2: 98, temp: 98.5 }
];

const INITIAL_MEDICINES = [
  {
    id: 'MED-1',
    name: 'Amoxicillin',
    category: 'Antibiotics',
    dosageForm: 'Capsule',
    strength: '500 mg',
    description: 'Penicillin-type antibiotic used to treat a wide variety of bacterial infections.',
    sideEffects: ['Nausea', 'Vomiting', 'Rash', 'Diarrhea'],
    contraindications: 'Penicillin hypersensitivity',
    controlled: false,
    price: '$12.50'
  },
  {
    id: 'MED-2',
    name: 'Metformin Hydrochloride',
    category: 'Antidiabetics',
    dosageForm: 'Tablet (Extended Release)',
    strength: '500 mg',
    description: 'First-line medication for the treatment of type 2 diabetes mellitus.',
    sideEffects: ['Gastrointestinal upset', 'Lactic acidosis (rare)', 'Vitamin B12 deficiency'],
    contraindications: 'Severe renal dysfunction (eGFR < 30)',
    controlled: false,
    price: '$8.20'
  },
  {
    id: 'MED-3',
    name: 'Lisinopril',
    category: 'Antihypertensives',
    dosageForm: 'Tablet',
    strength: '10 mg',
    description: 'ACE inhibitor used to treat high blood pressure and heart failure.',
    sideEffects: ['Dry cough', 'Dizziness', 'Hyperkalemia'],
    contraindications: 'Pregnancy, history of angioedema',
    controlled: false,
    price: '$6.00'
  },
  {
    id: 'MED-4',
    name: 'Atorvastatin',
    category: 'Cardiovascular',
    dosageForm: 'Tablet',
    strength: '20 mg',
    description: 'Statin medication used to prevent cardiovascular disease and lower cholesterol.',
    sideEffects: ['Muscle pain', 'Elevated liver enzymes', 'Headache'],
    contraindications: 'Active liver disease, pregnancy',
    controlled: false,
    price: '$15.00'
  },
  {
    id: 'MED-5',
    name: 'Alprazolam',
    category: 'Controlled Substances',
    dosageForm: 'Tablet',
    strength: '0.5 mg',
    description: 'Potent short-acting benzodiazepine prescribed for acute panic disorders.',
    sideEffects: ['Sedation', 'Dependency risk', 'Drowsiness'],
    contraindications: 'Acute narrow-angle glaucoma, severe respiratory depression',
    controlled: true,
    price: '$24.00'
  },
  {
    id: 'MED-6',
    name: 'Omeprazole',
    category: 'Antacids',
    dosageForm: 'Delayed-Release Capsule',
    strength: '20 mg',
    description: 'Proton pump inhibitor that decreases the amount of acid produced in the stomach.',
    sideEffects: ['Headache', 'Abdominal pain', 'Flatulence'],
    contraindications: 'Hypersensitivity to substituted benzimidazoles',
    controlled: false,
    price: '$9.90'
  }
];

const INITIAL_AUDIT_LOGS = [
  { id: 'LOG-881', timestamp: '2026-08-08 09:40', actor: 'Dr. Marcus Vance (Hospital)', action: 'Issued Digital Prescription RX901842', role: 'hospital' },
  { id: 'LOG-882', timestamp: '2026-08-08 08:30', actor: 'Eleanor Vance (Patient)', action: 'Logged Morning Vitals (BP 120/80)', role: 'user' },
  { id: 'LOG-883', timestamp: '2026-08-07 14:15', actor: 'State Health Board (Authority)', action: 'Flagged Controlled Substance RX903442 for Regulatory Audit', role: 'authority' },
  { id: 'LOG-884', timestamp: '2026-08-07 11:20', actor: 'Apex Health Guard (Reviewer)', action: 'Approved Prior-Authorization for RX901842', role: 'reviewer' },
  { id: 'LOG-885', timestamp: '2026-08-06 16:50', actor: 'Dr. Aris Thorne (Investigator)', action: 'Exported Anonymized Cohort A Trial Dataset', role: 'investigator' }
];

class DataStore {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem('medora_patient')) {
      localStorage.setItem('medora_patient', JSON.stringify(INITIAL_PATIENT));
    }
    if (!localStorage.getItem('medora_prescriptions')) {
      localStorage.setItem('medora_prescriptions', JSON.stringify(INITIAL_PRESCRIPTIONS));
    }
    if (!localStorage.getItem('medora_vitals')) {
      localStorage.setItem('medora_vitals', JSON.stringify(INITIAL_VITALS));
    }
    if (!localStorage.getItem('medora_medicines')) {
      localStorage.setItem('medora_medicines', JSON.stringify(INITIAL_MEDICINES));
    }
    if (!localStorage.getItem('medora_audit_logs')) {
      localStorage.setItem('medora_audit_logs', JSON.stringify(INITIAL_AUDIT_LOGS));
    }
  }

  getPatient() {
    return JSON.parse(localStorage.getItem('medora_patient'));
  }

  savePatient(data) {
    localStorage.setItem('medora_patient', JSON.stringify(data));
  }

  getPrescriptions(role = ROLES.USER, filterTab = 'all') {
    const list = JSON.parse(localStorage.getItem('medora_prescriptions')) || [];
    
    return list.filter(item => {
      // Role-Aware Base Filters
      if (role === ROLES.USER) {
        // Patient sees personal prescriptions
        if (item.patientId !== 'PT-89421') return false;
      } else if (role === ROLES.AUTHORITY) {
        // Authority sees controlled drug flags or high risk
        if (filterTab === 'controlled' && !item.controlledSubstance) return false;
        if (filterTab === 'flagged' && item.status !== 'flagged_audit') return false;
      } else if (role === ROLES.REVIEWER) {
        // Reviewer sees prior-auth queues
        if (filterTab === 'pending_auth' && item.priorAuthStatus !== 'pending') return false;
        if (filterTab === 'under_review' && item.priorAuthStatus !== 'under_review') return false;
      } else if (role === ROLES.INVESTIGATOR) {
        // Investigator sees anonymized cohort items
        if (filterTab === 'anonymized') return true;
      }

      // Filter Tabs Logic
      if (filterTab === 'all') return true;
      if (filterTab === 'active' && item.status === 'active') return true;
      if (filterTab === 'refills' && item.status === 'refill_requested') return true;
      if (filterTab === 'controlled' && item.controlledSubstance) return true;
      if (filterTab === 'flagged' && item.status === 'flagged_audit') return true;
      
      return filterTab === 'all';
    });
  }

  addPrescription(newRx) {
    const list = JSON.parse(localStorage.getItem('medora_prescriptions')) || [];
    list.unshift(newRx);
    localStorage.setItem('medora_prescriptions', JSON.stringify(list));
    this.addAuditLog('Issued Digital Prescription ' + newRx.rxNumber, newRx.doctorName);
  }

  updatePrescriptionStatus(id, newStatus, newPriorAuth) {
    const list = JSON.parse(localStorage.getItem('medora_prescriptions')) || [];
    const item = list.find(rx => rx.id === id);
    if (item) {
      if (newStatus) item.status = newStatus;
      if (newPriorAuth) item.priorAuthStatus = newPriorAuth;
      localStorage.setItem('medora_prescriptions', JSON.stringify(list));
    }
  }

  getVitals() {
    return JSON.parse(localStorage.getItem('medora_vitals')) || [];
  }

  addVital(entry) {
    const list = JSON.parse(localStorage.getItem('medora_vitals')) || [];
    list.unshift(entry);
    localStorage.setItem('medora_vitals', JSON.stringify(list));
    this.addAuditLog(`Logged Vitals (BP ${entry.bpSystolic}/${entry.bpDiastolic}, Pulse ${entry.heartRate})`, 'Eleanor Vance');
  }

  getMedicines() {
    return JSON.parse(localStorage.getItem('medora_medicines')) || [];
  }

  getAuditLogs() {
    return JSON.parse(localStorage.getItem('medora_audit_logs')) || [];
  }

  addAuditLog(action, actor = 'System User') {
    const logs = JSON.parse(localStorage.getItem('medora_audit_logs')) || [];
    const newLog = {
      id: 'LOG-' + Math.floor(100 + Math.random() * 900),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      actor: actor,
      action: action,
      role: localStorage.getItem('medora_active_role') || 'user'
    };
    logs.unshift(newLog);
    localStorage.setItem('medora_audit_logs', JSON.stringify(logs));
  }
}

export const store = new DataStore();
