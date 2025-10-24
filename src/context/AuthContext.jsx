import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🧠 Registrar nuevo usuario (rol pendiente por defecto)
  const signup = async (email, password, nombre) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const userRef = doc(db, 'usuarios', cred.user.uid);

    await setDoc(userRef, {
      email,
      nombre,
      rol: 'pendiente', // hasta aprobación
      empresaId: null,
      modulos: {
        tareas: false,
        facturacion: false,
        administracion: false
      },
      creadoEn: new Date().toISOString()
    });

    setCurrentUser(cred.user);
  };

  // 🔐 Login
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // 🚪 Logout
  const logout = () => signOut(auth);

  // 👁️ Escuchar sesión activa
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'usuarios', user.uid);
        const userDoc = await getDoc(docRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const value = {
    currentUser,
    userData,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

