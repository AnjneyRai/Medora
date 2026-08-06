import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

  const firebaseConfig = {
    apiKey: "AIzaSyDjOR_xZuepfkaHDZFxw-r498bRvrHRdRY",
    authDomain: "medora-cyberknights.firebaseapp.com",
    projectId: "medora-cyberknights",
    storageBucket: "medora-cyberknights.firebasestorage.app",
    messagingSenderId: "536762487303",
    appId: "1:536762487303:web:26e43a0e67b83a366c50a2"
  };
  const app = initializeApp(firebaseConfig);

  import {

getAuth,

signInWithEmailAndPassword

}

from

"https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const auth = getAuth(app);

const emailInput = document.getElementById("email");

const passwordInput = document.getElementById("password");

const loginButton = document.getElementById("loginBtn");

loginButton.addEventListener("click", () => {

    const email = emailInput.value;
    const password = passwordInput.value;

    signInWithEmailAndPassword(auth, email, password)

    .then((userCredential) => {

        alert("Login Successful!");

        window.location.href = "dashboard.html";

    })

    .catch((error) => {

        alert(error.message);

    });

});

