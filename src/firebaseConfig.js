



import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase config
// const firebaseConfig = {
//     apiKey: "AIzaSyALrRAbGK3OsU6vplZt6APkij_KyyJU-Mg",
//     authDomain: "to-do-list-d189f.firebaseapp.com",
//     projectId: "to-do-list-d189f",
//     storageBucket: "to-do-list-d189f.firebasestorage.app",
//     messagingSenderId: "1094691345720",
//     appId: "1:1094691345720:web:7b708faabe5f8e6f73ddcd",
//     measurementId: "G-HN49JXCSJS"
//   };

const firebaseConfig = {
  apiKey: "AIzaSyCwpxljmgvjDATKABd39SrZozsdtl2-aIc",
  authDomain: "back-office-panel-c137e.firebaseapp.com",
  projectId: "back-office-panel-c137e",
  storageBucket: "back-office-panel-c137e.firebasestorage.app",
  messagingSenderId: "176339360429",
  appId: "1:176339360429:web:76ee1e7fa7e68dee200424",
  measurementId: "G-64WQV9PWR5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
