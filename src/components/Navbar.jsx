// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => setMenuAbierto(!menuAbierto);
  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="logo cuaderno rural.png" alt="Logo" />
        <span>AgroCuaderno</span>
      </div>

      <button className="navbar-toggle" onClick={toggleMenu}>
        ☰
      </button>

      <div className={`navbar-links ${menuAbierto ? 'abierto' : ''}`}>
        <Link
          to="/"
          className={location.pathname === '/' ? 'active' : ''}
          onClick={cerrarMenu}
        >
          Tareas
        </Link>
        <Link
          to="/facturacion"
          className={location.pathname === '/facturacion' ? 'active' : ''}
          onClick={cerrarMenu}
        >
          Facturación
        </Link>
        <Link
          to="/admin"
          className={location.pathname === '/admin' ? 'active' : ''}
          onClick={cerrarMenu}
        >
          Administración
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;


