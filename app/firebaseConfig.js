// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYWz6JmbSz7399nml8d7QaORhOMaY0nb0",
  authDomain: "pantry-36337.firebaseapp.com",
  projectId: "pantry-36337",
  storageBucket: "pantry-36337.appspot.com",
  messagingSenderId: "702745019000",
  appId: "1:702745019000:web:58ecf1c1b2cb66f149e38d",
  measurementId: "G-4KHJNL3QLQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth

export {auth}