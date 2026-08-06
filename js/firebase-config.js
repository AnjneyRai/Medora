// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDjOR_xZuepfkaHDZFxw-r498bRvrHRdRY",
    authDomain: "medora-cyberknights.firebaseapp.com",
    projectId: "medora-cyberknights",
    storageBucket: "medora-cyberknights.firebasestorage.app",
    messagingSenderId: "536762487303",
    appId: "1:536762487303:web:26e43a0e67b83a366c50a2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export Firestore
export { db };