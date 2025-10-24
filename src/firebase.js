// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Tu configuración de Firebase (mantén tus valores)
const firebaseConfig = {
  apiKey: "AIzaSyB0Z4HjUyl5Wa9daxlavpsg4uRCKRFDwwc",
  authDomain: "cuaderno-digital-128f1.firebaseapp.com",
  projectId: "cuaderno-digital-128f1",
  storageBucket: "cuaderno-digital-128f1.firebasestorage.app",
  messagingSenderId: "917213533150",
  appId: "1:917213533150:web:5a779dee99118d44ac834f",
  measurementId: "G-7JKM3J3H3L"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore y Auth
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
