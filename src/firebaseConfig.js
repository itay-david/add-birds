// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Ensure you're importing this

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNy08Z_CtrMkoiwD5ipvFXF9bPXmdHfqE",
  authDomain: "birds-data-e5ec9.firebaseapp.com",
  projectId: "birds-data-e5ec9",
  storageBucket: "birds-data-e5ec9.appspot.com",
  messagingSenderId: "528948918225",
  appId: "1:528948918225:web:f9475a72aba23321d7d2f0",
  measurementId: "G-Z94T2X8EEC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Initialize Realtime Database

export default database; // Export the database object
