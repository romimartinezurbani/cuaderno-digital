// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0Z4HjUyl5Wa9daxlavpsg4uRCKRFDwwc",
  authDomain: "cuaderno-digital-128f1.firebaseapp.com",
  projectId: "cuaderno-digital-128f1",
  storageBucket: "cuaderno-digital-128f1.firebasestorage.app",
  messagingSenderId: "917213533150",
  appId: "1:917213533150:web:5a779dee99118d44ac834f",
  measurementId: "G-7JKM3J3H3L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };