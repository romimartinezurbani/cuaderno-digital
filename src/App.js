import React, { useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskTable from './components/TaskTable';
import BillingDashboard from './components/BillingDashboard';
import './styles/table.css'; // Asegúrate de que este import esté para usar .btn

function App() {
  const [pantalla, setPantalla] = useState('tareas');

  return (
    <div>
      <nav style={{ margin: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button
          className="btn"
          onClick={() => setPantalla('tareas')}
        >
          Tareas
        </button>
        <button
          className="btn"
          onClick={() => setPantalla('facturacion')}
        >
          Facturación
        </button>
      </nav>

      {pantalla === 'tareas' && (
        <>
          <TaskForm />
          <TaskTable />
        </>
      )}

      {pantalla === 'facturacion' && <BillingDashboard />}
    </div>
  );
}

export default App;

