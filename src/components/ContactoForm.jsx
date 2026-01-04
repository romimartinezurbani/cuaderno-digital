import React, { useState } from "react";
import {
  collection,
  doc,
  runTransaction,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import "../styles/form.css";

const ContactoForm = ({ onContactoAgregado }) => {
  const { userData } = useAuth();

  const [formData, setFormData] = useState({
    tipo: "cliente", // 👈 NUEVO
    nombre: "",
    cuit: "",
    razonSocial: "",
    condicionIva: "",
    domicilio: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.cuit) {
      alert("Nombre y CUIT son obligatorios");
      return;
    }

    const empresaId = userData?.empresaId;
    if (!empresaId) {
      alert("No se pudo identificar la empresa");
      return;
    }

    const counterRef = doc(
      db,
      "counters",
      `${formData.tipo}_${empresaId}`
    );

    const contactosRef = collection(db, "contactos");

    await runTransaction(db, async (transaction) => {
      const counterSnap = await transaction.get(counterRef);

      let nuevoNumero = 1;
      if (counterSnap.exists()) {
        nuevoNumero = counterSnap.data().lastNumber + 1;
      }

      transaction.set(
        counterRef,
        { lastNumber: nuevoNumero },
        { merge: true }
      );

      const nuevoContactoRef = doc(contactosRef);

      transaction.set(nuevoContactoRef, {
        ...formData,
        nro: nuevoNumero,
        empresaId,
        createdAt: serverTimestamp(),
      });
    });

    setFormData({
      tipo: "cliente",
      nombre: "",
      cuit: "",
      razonSocial: "",
      condicionIva: "",
      domicilio: "",
    });

    onContactoAgregado();
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>
        Registrar {formData.tipo === "cliente" ? "Cliente" : "Proveedor"}
      </h2>

      <div className="form-grid-two">
        <div className="form-column">

          {/* 👇 NUEVO SELECT */}
          <div className="form-group">
            <label>Tipo *</label>
            <select name="tipo" value={formData.tipo} onChange={handleChange}>
              <option value="cliente">Cliente</option>
              <option value="proveedor">Proveedor</option>
            </select>
          </div>

          <div className="form-group">
            <label>Nombre *</label>
            <input name="nombre" value={formData.nombre} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>CUIT *</label>
            <input name="cuit" value={formData.cuit} onChange={handleChange} />
          </div>
        </div>

        <div className="form-column">
          <div className="form-group">
            <label>Razón Social</label>
            <input name="razonSocial" value={formData.razonSocial} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Condición IVA</label>
            <input name="condicionIva" value={formData.condicionIva} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Domicilio</label>
            <input name="domicilio" value={formData.domicilio} onChange={handleChange} />
          </div>
        </div>
      </div>

      <button type="submit">
        Guardar {formData.tipo === "cliente" ? "Cliente" : "Proveedor"}
      </button>
    </form>
  );
};

export default ContactoForm;


