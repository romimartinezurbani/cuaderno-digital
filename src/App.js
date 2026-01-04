import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import ContactoView from './modules/contactos/ContactoView';
import Tareas from './modules/tareas';
import Facturacion from './modules/facturacion';
import Gastos from './modules/gastos';
import Admin from './modules/administracion/Admin';
import Layout from './components/Layout';
import ComoOrganizarTuTrabajo from "./pages/ComoOrganizarTuTrabajo";
import { AuthProvider } from './context/AuthContext';
import Bienvenida from './pages/Bienvenida';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas SIN navbar */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/como-organizar-tu-trabajo" element={<ComoOrganizarTuTrabajo />} />

          {/* Rutas CON navbar (dentro del Layout) */}
          <Route element={<Layout />}>
            <Route
              path="/bienvenida"
              element={
                <ProtectedRoute>
                  <Bienvenida />
                </ProtectedRoute>
              }
            />

            
            <Route 
              path="/contactos" 
              element={
                <ProtectedRoute modulo="contactos">
                  <ContactoView />
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
              <Route
                path="/gastos"
                element={
                  <ProtectedRoute modulo="gastos">
                    <Gastos />
                  </ProtectedRoute>
                }
              />

              <Route
              path="/tareas"
              element={
                <ProtectedRoute modulo="tareas">
                  <Tareas />
                </ProtectedRoute>
              }
            />
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
          </Route>

          <Route path="*" element={<h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Página no encontrada</h2>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;






