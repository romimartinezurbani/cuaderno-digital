import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo cuaderno rural.png';
import '../styles/navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      {/* Logo + menú hamburguesa */}
        <div className="navbar-left">
        {/* 🔗 Logo clickeable que lleva al Home */}
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Logo" className="navbar-logo-img" />
        </Link>
        <button
          className="navbar-toggle"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          ☰
        </button>
      </div>

      {/* Enlaces */}
      {currentUser && (
        <div className={`navbar-links ${menuAbierto ? 'abierto' : ''}`}>
          <Link to="/clientes" onClick={() => setMenuAbierto(false)}>Clientes</Link>
          <Link to="/tareas" onClick={() => setMenuAbierto(false)}>Tareas</Link>
          <Link to="/facturacion" onClick={() => setMenuAbierto(false)}>Facturación</Link>
          <Link to="/admin" onClick={() => setMenuAbierto(false)}>Administración</Link>
        </div>
      )}

      {/* Botón derecho */}
      <div className="navbar-right">
        {currentUser ? (
          <button onClick={handleLogout} className="btn">Cerrar sesión</button>
        ) : (
          <Link to="/login" className="btn">Iniciar sesión</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;





