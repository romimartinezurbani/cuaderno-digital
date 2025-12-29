import React from "react";
import { CheckCircle2, Star } from "lucide-react";
import "../styles/ComoOrganizarTuTrabajo.css";
import workImage from "../assets/trabajorural.jpg";
import FloatingContact from '../components/FloatingBotton';

export default function ComoOrganizarTuTrabajo() {
  return (
    <div className="como-organizar-page">

      <section className="como-organizar-hero">
        <h1>Conocé cómo organizar tu trabajo</h1>

       </section> 

       <section className="visual-section">
            <div className="visual-grid">
            <div className="visual-text">
            <h2>Organizar tu trabajo también es parte del negocio</h2>
            <p>
                Tener la información ordenada te permite trabajar más tranquilo,
                cobrar a tiempo y tomar mejores decisiones.
            </p>
            <p>
                Esta forma de trabajo se adapta a vos, no al revés.
            </p>
            </div>

            <div className="visual-image">
            <img src={workImage} alt="Organización del trabajo diario" />
            </div>
        </div>

      </section>

      <section className="como-organizar-section">
        <h2>¿Para qué sirve?</h2>
        <p>
          Está pensada para contratistas, productores y pequeños emprendedores
          que hoy anotan todo en cuadernos, papeles o planillas sueltas.
          Acá podés centralizar toda tu información en un solo lugar.
        </p>
      </section>

      <section className="como-organizar-section">
        <h2>¿Qué podés hacer?</h2>

        <ul className="check-list">
          <li><CheckCircle2 /> Registrar tareas por lote, campo o cliente</li>
          <li><CheckCircle2 /> Cargar gastos y saber en qué se va la plata</li>
          <li><CheckCircle2 /> Llevar facturación y cobranzas ordenadas</li>
          <li><CheckCircle2 /> Consultar tu información cuando la necesites</li>
          <li><CheckCircle2 /> Exportar datos a Excel o PDF</li>
        </ul>
      </section>

      <section className="como-organizar-section highlight">
        <h2>Versiones disponibles</h2>

        <div className="versiones-grid">
          <div className="version-card">
            <h3>Versión Base</h3>
            <p>
              Ideal para empezar a ordenar tu trabajo.
            </p>
            <ul>
              <li>✔ Registro de tareas</li>
              <li>✔ Carga de gastos</li>
              <li>✔ Facturación y cobranzas</li>
              <li>✔ Listados claros y simples</li>
            </ul>
          </div>

          <div className="version-card pro">
            <h3>
              Versión Pro <Star size={16} />
            </h3>
            <p>
              Para quienes quieren ir un paso más allá.
            </p>
            <ul>
              <li>✔ Todo lo de la versión base</li>
              <li>✔ Dashboard con indicadores</li>
              <li>✔ Resúmenes automáticos</li>
              <li>✔ Información clave para decidir mejor</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="cta-soft">
        <h2>¿Querés ver cómo se adapta a tu forma de trabajar?</h2>
        <p>
            Podemos coordinar una demo personalizada o una capacitación
            para vos y tu equipo.
        </p>
        <button onClick={() => window.open('https://wa.me/5493584244240')}>
            Contactame
        </button>
    </section>

    <FloatingContact />

    </div>

  );
}
