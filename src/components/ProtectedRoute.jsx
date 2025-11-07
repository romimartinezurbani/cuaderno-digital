
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, modulo }) => {
  const { currentUser, userData } = useAuth();

  console.log("🔍 ProtectedRoute ejecutado", { currentUser, userData, modulo });

  if (!currentUser) {
    console.log("⛔ Sin sesión, redirigiendo a login");
    return <Navigate to="/login" replace />;
  }

  if (!userData) {
    console.log("⌛ Cargando datos del usuario...");
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem', color: 'gray' }}>
        <h3>Cargando datos del usuario...</h3>
      </div>
    );
  }

  if (userData.rol === 'pendiente') {
    console.log("🕓 Usuario pendiente");
    return (
      <div style={{ textAlign: 'center', marginTop: '3rem', color: '#555' }}>
        <h2>⏳ Cuenta pendiente de aprobación</h2>
        <p>Tu cuenta está en revisión por el equipo de Admify.</p>
      </div>
    );
  }

  if (userData.rol === 'admin') {
    console.log("👑 Admin, acceso total");
    return children;
  }

  const permisoModulo = userData.modulos?.[modulo?.toLowerCase()];

  console.log("🔑 Permiso módulo:", modulo, permisoModulo);

  if (modulo && !permisoModulo) {
    console.log("🚫 Acceso restringido a módulo:", modulo);
    return (
      <div style={{ textAlign: 'center', marginTop: '3rem', color: '#555' }}>
        <h2>🚫 Acceso restringido</h2>
        <p>No tenés permiso para acceder a este módulo.</p>
      </div>
    );
  }

  console.log("✅ ProtectedRoute renderizado correctamente con módulo:", modulo);
  return children;
};

export default ProtectedRoute;

