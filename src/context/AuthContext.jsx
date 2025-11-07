import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🧠 Registrar nuevo usuario
  const signup = async (email, password, nombre) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const userRef = doc(db, "usuarios", cred.user.uid);

    await setDoc(userRef, {
      email,
      nombre,
      rol: "pendiente",
      empresaId: null,
      modulos: {
        tareas: false,
        facturacion: false,
        clientes: false,
        administracion: false,
      },
      creadoEn: new Date().toISOString(),
    });

    setCurrentUser(cred.user);
  };

  // 🔐 Login y logout
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  // 👁️ Escuchar sesión activa y datos del usuario
  useEffect(() => {
    console.log("🧩 Iniciando listener de autenticación...");
    let unsubUser = null;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("✅ Usuario autenticado:", user.email);
        setCurrentUser(user);

        const docRef = doc(db, "usuarios", user.uid);
        unsubUser = onSnapshot(
          docRef,
          (snapshot) => {
            if (snapshot.exists()) {
              console.log("📄 Datos de usuario cargados:", snapshot.data());
              setUserData(snapshot.data());
            } else {
              console.warn("⚠️ Documento de usuario no encontrado.");
              setUserData(null);
            }
            setLoading(false);
          },
          (error) => {
            console.error("❌ Error al escuchar usuario:", error);
            setLoading(false);
          }
        );
      } else {
        console.log("🚪 Sesión cerrada.");
        setCurrentUser(null);
        setUserData(null);
        setLoading(false);
        if (unsubUser) unsubUser();
      }
    });

    return () => {
      console.log("🧹 Limpiando listeners de auth...");
      unsubAuth();
      if (unsubUser) unsubUser();
    };
  }, []);

  const value = {
    currentUser,
    userData,
    signup,
    login,
    logout,
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "3rem", color: "gray" }}>
        <h3>🔄 Cargando sesión...</h3>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


