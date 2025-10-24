import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, modulo }) => {
  const { currentUser, userData } = useAuth();

  if (!currentUser) return <Navigate to="/login" replace />;

  if (!userData) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem', color: 'gray' }}>
        <h3>Cargando datos del usuario...</h3>
      </div>
    );
  }

  // 🔒 Usuario pendiente
  if (userData.rol === 'pendiente') {
    return (
      <div style={{ textAlign: 'center', marginTop: '3rem', color: '#555' }}>
        <h2>⏳ Cuenta pendiente de aprobación</h2>
        <p>Tu cuenta está en revisión por el equipo de Admify.</p>
      </div>
    );
  }

  // 👑 Administrador: acceso total
  if (userData.rol === 'admin') {
    return children;
  }

  // ⚙️ Validar permisos por módulo
  if (modulo && !userData.modulos?.[modulo]) {
    return (
      <div style={{ textAlign: 'center', marginTop: '3rem', color: '#555' }}>
        <h2>🚫 Acceso restringido</h2>
        <p>No tenés permiso para acceder a este módulo.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
