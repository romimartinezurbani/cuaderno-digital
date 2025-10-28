import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import ClientesView from './modules/clientes/ClientesView';
import Tareas from './modules/tareas';
import Facturacion from './modules/facturacion';
import Admin from './modules/administracion/Admin';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Página de inicio */}
          <Route path="/" element={<Home />} />

          {/* Autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas */}
          <Route
            path="/tareas"
            element={
              <ProtectedRoute modulo="tareas">
                <Tareas />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/clientes" 
            element={
            <ProtectedRoute modulo="Clientes">
              <ClientesView />
            </ProtectedRoute>
            }
            />


          <Route
            path="/facturacion"
            element={
              <ProtectedRoute modulo="facturacion">
                <Facturacion />
              </ProtectedRoute>
            }
          />

          {/* Panel administrativo (dos rutas válidas) */}
          <Route
            path="/administracion"
            element={
              <ProtectedRoute modulo="administracion">
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute modulo="administracion">
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* Ruta 404 opcional */}
          <Route path="*" element={<h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Página no encontrada</h2>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;





