// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";


import firebase from "firebase/compat/app";
// Required for side-effects
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYWz6JmbSz7399nml8d7QaORhOMaY0nb0",
  authDomain: "pantry-36337.firebaseapp.com",
  projectId: "pantry-36337",
  storageBucket: "pantry-36337.appspot.com",
  messagingSenderId: "702745019000",
  appId: "1:702745019000:web:1a302f88fa52e1ea49e38d",
  measurementId: "G-63VTG6HVEE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analytics;
if (typeof window !== 'undefined' && isSupported()) {
  analytics = getAnalytics(app);
}


export const db = getFirestore(app);
const auth = getAuth(app);

export {auth}