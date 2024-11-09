// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// export const auth = getAuth(app);
// export const db = getFirestore(app);




import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyALrRAbGK3OsU6vplZt6APkij_KyyJU-Mg",
    authDomain: "to-do-list-d189f.firebaseapp.com",
    projectId: "to-do-list-d189f",
    storageBucket: "to-do-list-d189f.firebasestorage.app",
    messagingSenderId: "1094691345720",
    appId: "1:1094691345720:web:7b708faabe5f8e6f73ddcd",
    measurementId: "G-HN49JXCSJS"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };