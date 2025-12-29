import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ClipboardList, DollarSign, TrendingUp, FileText, MessageCircle, Instagram, X } from 'lucide-react';
import heroImage from '../assets/hero-rural.jpg';
import dashboardImage from '../assets/dashboard-preview.jpg';
import '../styles/Home.css';
import FloatingContact from '../components/FloatingBotton';

const benefits = [
  {
    icon: ClipboardList,
    title: "Registro de Tareas",
    description: "Llevá un control detallado de todas tus tareas por lote, campo o cliente."
  },
  {
    icon: DollarSign,
    title: "Control de Facturación",
    description: "Gestioná facturas, comprobantes y mantené tu contabilidad al día."
  },
  {
    icon: TrendingUp,
    title: "Seguimiento de Gastos",
    description: "Registrá y categorizá todos tus gastos operativos y calculá rentabilidad."
  },
  {
    icon: FileText,
    title: "Reportes Automáticos",
    description: "Generá reportes detallados y exportá datos a Excel o PDF cuando los necesites."
  }
];

const features = [
  "Registro de tareas por lote, campo o cliente",
  "Control de horas trabajadas y personal",
  "Gestión completa de facturas y comprobantes",
  "Seguimiento de gastos por categoría",
  "Cálculo automático de rentabilidad",
  "Recordatorios de pagos y cobros",
  "Exportación de datos a Excel y PDF",
  "Acceso desde cualquier dispositivo",
];

function Home() {
  const navigate = useNavigate();

  const [openFab, setOpenFab] = useState(false);

  const whatsappLink = 'https://wa.me/5493584244240';
  const instagramLink = 'https://www.instagram.com/admify_solucionesintegrales/';

   return (
    <div className="home-page">

      {/* Header */}
      <header className="header">
        <div className="header-container">
          <a href="/" className="header-logo">
            <div className="header-logo-icon">
              <span className="header-logo-text">CD</span>
            </div>
            <span className="header-brand-name">Cuaderno Digital</span>
          </a>
          <button
            className="header-login-btn"
            onClick={() => navigate('/login')}
          >
            Iniciar sesión
          </button>
        </div>
      </header>

      {/* Hero */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(82, 104, 61, 0.85) 0%, rgba(95, 120, 70, 0.75) 100%), url(${heroImage})`,
        }}
      >
        <div className="hero-container">
          <h1 className="hero-title">
            Gestioná tu trabajo rural
            <br />
            de forma profesional
          </h1>

          <p className="hero-subtitle">
            Organizá tareas, controlá facturación y llevá el registro completo de tu actividad como contratista
          </p>

          <div className="hero-buttons">
            <button
              className="hero-btn-primary"
              onClick={() => navigate('/como-organizar-tu-trabajo')}
            >
              Conocé cómo organizar tu trabajo
            </button>

            <button
              className="hero-btn-secondary"
              onClick={() => window.open(whatsappLink, '_blank')}
            >
              Hablá con nosotros
            </button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="benefits-section">
        <div className="benefits-container">
          <div className="benefits-header">
            <h2 className="benefits-title">¿Por qué Cuaderno Digital?</h2>
            <p className="benefits-subtitle">
              Diseñado específicamente para las necesidades de contratistas rurales
            </p>
          </div>

          <div className="benefits-grid">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="benefit-card">
                  <div className="benefit-icon-wrapper">
                    <Icon className="benefit-icon" />
                  </div>
                  <h3 className="benefit-title">{benefit.title}</h3>
                  <p className="benefit-description">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="dashboard-preview-section">
        <div className="dashboard-preview-container">
          <div className="dashboard-preview-header">
            <h2 className="dashboard-preview-title">Simple, intuitivo y poderoso</h2>
            <p className="dashboard-preview-subtitle">
              Una interfaz diseñada para que puedas enfocarte en tu trabajo
            </p>
          </div>

          <div className="dashboard-preview-image-wrapper">
            <img
              src={dashboardImage}
              alt="Vista previa del sistema"
              className="dashboard-preview-image"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Empezá a organizar tu trabajo hoy mismo</h2>
          <p className="cta-subtitle">Sin complicaciones. Comenzá en minutos.</p>
          <button
            className="cta-button"
            onClick={() => window.open(whatsappLink, '_blank')}
          >
            Solicitar una demo gratuita
            <ArrowRight className="hero-btn-icon" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <p>&copy; 2025 Cuaderno Digital. Diseñado por Admify Soluciones Integrales.</p>
        </div>
      </footer>

    <FloatingContact />

   </div>
  );
}
export default Home;


