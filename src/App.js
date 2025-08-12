// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TaskForm from './components/TaskForm';
import TaskTable from './components/TaskTable';
import BillingDashboard from './components/BillingDashboard';
import './styles/table.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="main-container">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <TaskForm />
                <TaskTable />
              </>
            }
          />
          <Route path="/facturacion" element={<BillingDashboard />} />
          <Route path="/admin" element={<div>Configuración de usuarios (en construcción)</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;


