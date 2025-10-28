import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/form.css";

const ClienteForm = ({ onClienteAdded }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    nroCliente: "",
    cuit: "",
    razonsocial: "",
    condicionIva: "",
    domicilio: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.cuit) {
      alert("Por favor complete los campos obligatorios (Nombre y CUIT).");
      return;
    }
    await addDoc(collection(db, "clientes"), {
      ...formData,
      createdAt: new Date(),
    });
    onClienteAdded();
    setFormData({
      nombre: "",
      nroCliente: "",
      cuit: "",
      razonsocial: "",
      condicionIva: "",
      domicilio: "",
    });
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>Registrar Cliente</h2>

      <div className="form-grid-two">
        <div className="form-column">
          <div className="form-group">
            <label>Nombre *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre o razón social"
              required
            />
          </div>

          <div className="form-group">
            <label>N° Cliente</label>
            <input
              type="text"
              name="nroCliente"
              value={formData.nroCliente}
              onChange={handleChange}
              placeholder="Código interno"
            />
          </div>

          <div className="form-group">
            <label>CUIT *</label>
            <input
              type="text"
              name="cuit"
              value={formData.cuit}
              onChange={handleChange}
              placeholder="Ej: 20-12345678-9"
              required
            />
          </div>
        </div>

        <div className="form-column">
          <div className="form-group">
            <label>Razón Social</label>
            <input
              type="text"
              name="razonsocial"
              value={formData.razonsocial}
              onChange={handleChange}
              placeholder="Razón social"
            />
          </div>

          <div className="form-group">
            <label>Condición IVA</label>
            <input
              type="text"
              name="condicionIva"
              value={formData.condicionIva}
              onChange={handleChange}
              placeholder="Ej: Responsable Inscripto, Monotributo..."
            />
          </div>

          <div className="form-group">
            <label>Domicilio</label>
            <input
              type="text"
              name="domicilio"
              value={formData.domicilio}
              onChange={handleChange}
              placeholder="Dirección completa"
            />
          </div>
        </div>
      </div>

      <button type="submit">Guardar Cliente</button>
    </form>
  );
};

export default ClienteForm;
