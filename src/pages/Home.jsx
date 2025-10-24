import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css'


function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">Bienvenido a tu Cuaderno Digital</h1>
      <p className="home-subtitle">
        Organizá tus tareas, controlá tu facturación y gestioná todo desde un solo lugar.
      </p>
      <div className="home-buttons">
        <button onClick={() => navigate('/tareas')}>Ir a Tareas</button>
        <button onClick={() => navigate('/facturacion')}>Ver Facturación</button>
      </div>
    </div>
  );
}

export default Home;


