import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  setDoc,
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🧠 REGISTRO
  const signup = async ({ email, password, nombre, empresa }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    // Empresa mínima
    const empresaRef = await addDoc(collection(db, "empresas"), {
      nombre: empresa,
      activa: false,
      ownerId: cred.user.uid,
      createdAt: serverTimestamp(),
    });

    // Usuario sin permisos
    await setDoc(doc(db, "usuarios", cred.user.uid), {
      nombre,
      email,
      empresaId: empresaRef.id,
      rol: "usuario",
      estado: "pendiente",
      modulos: {
        tareas: false,
        clientes: false,
        gastos: false,
        facturacion: false,
        administracion: false,
      },
      creadoEn: serverTimestamp(),
    });

    return cred.user;
  };

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  // 👁️ Listener de sesión + Firestore
  useEffect(() => {
    let unsubscribeUser = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);

        const userRef = doc(db, "usuarios", user.uid);
        unsubscribeUser = onSnapshot(userRef, (snap) => {
          setUserData(snap.exists() ? snap.data() : null);
          setLoading(false);
        });
      } else {
        setCurrentUser(null);
        setUserData(null);
        setLoading(false);
        if (unsubscribeUser) unsubscribeUser();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUser) unsubscribeUser();
    };
  }, []);

  const value = {
    currentUser,
    userData,
    empresaId: userData?.empresaId,
    rol: userData?.rol,
    modulos: userData?.modulos,
    signup,
    login,
    logout,
    isAdmin: userData?.rol === "admin",
  };

  if (loading) {
    return <div style={{ textAlign: "center" }}>Cargando sesión…</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};




