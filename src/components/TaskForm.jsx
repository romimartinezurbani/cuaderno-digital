// src/components/TaskForm.jsx
import React, { useState } from 'react';
import '../styles/form.css';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import ClientInput from './ClientInput';

const TaskForm = () => {
  const [formData, setFormData] = useState({
    fecha: '',
    cliente: '',
    campo: '',
    lote: '',
    tarea: '',
    hectareas: '',
    usdPorHa: '',
    nroorden: '',
    observaciones: '',
    facturado: false,
    cobrado: false,
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.cliente) {
      setError('⚠️ Tenés que seleccionar o escribir un cliente válido.');
      return;
    }

    try {
      await addDoc(collection(db, 'tareas'), formData);
      alert('Tarea guardada correctamente ✅');
      setFormData({
        fecha: '',
        cliente: '',
        campo: '',
        lote: '',
        tarea: '',
        hectareas: '',
        usdPorHa: '',
        nroorden: '',
        observaciones: '',
        facturado: false,
        cobrado: false,
      });
      setError('');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('❌ Hubo un error al guardar los datos.');
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>Registrar tarea</h2>

      <div className="form-group">
        <label>Fecha:</label>
        <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Cliente:</label>
        <ClientInput
          onSelectClient={(nombreCliente) =>
            setFormData((prev) => ({ ...prev, cliente: nombreCliente }))
          }
        />
        {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
      </div>

      <div className="form-group">
        <label>Campo:</label>
        <input type="text" name="campo" value={formData.campo} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Lote:</label>
        <input type="text" name="lote" value={formData.lote} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Tarea:</label>
        <select name="tarea" value={formData.tarea} onChange={handleChange} required>
          <option value="">Seleccionar</option>
          <option value="Fertilización">Fertilización</option>
          <option value="Siembra">Siembra</option>
          <option value="Fumigación">Fumigación</option>
          <option value="Cosecha">Cosecha</option>
        </select>
      </div>

      <div className="form-group">
        <label>Hectáreas:</label>
        <input
          type="number"
          name="hectareas"
          value={formData.hectareas}
          onChange={handleChange}
          min="0"
          required
        />
      </div>

      <div className="form-group">
        <label>USD por ha:</label>
        <input
          type="number"
          name="usdPorHa"
          value={formData.usdPorHa}
          onChange={handleChange}
          min="0"
          required
        />
      </div>

      <div className="form-group">
        <label>Nro Orden:</label>
        <input type="text" name="nro orden" value={formData.nroorden} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Observaciones:</label>
        <textarea name="observaciones" value={formData.observaciones} onChange={handleChange}></textarea>
      </div>

      <div className="form-group checkbox">
        <label>
          <input type="checkbox" name="facturado" checked={formData.facturado} onChange={handleChange} />
          Facturado
        </label>
        <label>
          <input type="checkbox" name="cobrado" checked={formData.cobrado} onChange={handleChange} />
          Cobrado
        </label>
      </div>

      <button type="submit">Guardar</button>
    </form>
  );
};

export default TaskForm;
