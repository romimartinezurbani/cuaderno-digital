import React from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Users, DollarSign, FileText } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/Bienvenida.css";

export default function Bienvenida() {
  const { userData } = useAuth();
  const navigate = useNavigate();

  if (!userData) return null;

  const modulos = userData.modulos || {};

  const accesos = [
    {
      key: "tareas",
      label: "Tareas",
      icon: <ClipboardList />,
      path: "/tareas",
    },
    {
      key: "contactos",
      label: "Contactos",
      icon: <Users />,
      path: "/contactos",
    },
    {
      key: "gastos",
      label: "Gastos",
      icon: <DollarSign />,
      path: "/gastos",
    },
    {
      key: "facturacion",
      label: "Facturación",
      icon: <FileText />,
      path: "/facturacion",
    },
  ];

  return (
    <div className="bienvenida-page">
      <h1>Bienvenido/a a Cuaderno Digital</h1>

      <p className="bienvenida-subtitle">
        Estás dentro de tu espacio de trabajo. Elegí por dónde comenzar.
      </p>

      <div className="bienvenida-grid">
        {accesos
          .filter((a) => modulos[a.key])
          .map((acceso) => (
            <button
              key={acceso.key}
              className="bienvenida-card"
              onClick={() => navigate(acceso.path)}
            >
              <div className="icon">{acceso.icon}</div>
              <span>{acceso.label}</span>
            </button>
          ))}
      </div>

      {Object.values(modulos).every((v) => !v) && (
        <div className="bienvenida-pendiente">
          <p>
            Tu acceso está pendiente de habilitación.
            <br />
            Contactá al administrador para continuar.
          </p>
        </div>
      )}
    </div>
  );
}
