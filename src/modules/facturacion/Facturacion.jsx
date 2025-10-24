import React from 'react';
import BillingDashboard from '../../components/BillingDashboard';
import '../../styles/billing.css';

const Facturacion = () => {
  return (
    <div className="facturacion-container">
      <h2 className="section-title">Facturación y Cobranza</h2>
      <BillingDashboard />
    </div>
  );
};

export default Facturacion;
