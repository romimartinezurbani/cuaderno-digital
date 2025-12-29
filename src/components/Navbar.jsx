import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MODULOS } from "../config/modulos";
import logo from "../assets/logo cuaderno rural.png";
import "../styles/navbar.css";

const Navbar = () => {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  if (!userData) return null;

  const cerrarSesion = async () => {
    await logout();
    navigate("/login");
  };

  const puedeVerModulo = (modulo) => {
    if (modulo.soloAdmin && userData.rol !== "admin") return false;
    if (!modulo.key) return false;
    return Boolean(userData.modulos?.[modulo.key]);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/tareas" className="navbar-logo">
          <img src={logo} alt="Cuaderno Digital" className="header-logo-img" />
          <span>Cuaderno Digital</span>
        </Link>

        <button
          className="navbar-toggle"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          ☰
        </button>

        <div className={`navbar-links ${menuAbierto ? "open" : ""}`}>
          {MODULOS.filter(puedeVerModulo).map((mod) => (
            <Link
              key={mod.key}
              to={mod.path}
              onClick={() => setMenuAbierto(false)}
            >
              {mod.label}
            </Link>
          ))}

          <button className="logout-btn" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;







