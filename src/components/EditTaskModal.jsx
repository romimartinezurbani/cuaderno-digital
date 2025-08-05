import React, { useState } from 'react';
import '../styles/EditTaskModal.css'

const EditTaskModal = ({ task, onClose, onSave }) => {
  const [editedTask, setEditedTask] = useState({ ...task });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedTask((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    onSave(editedTask);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Editar tarea</h2>
        <form>
          <label>
            Fecha:
            <input type="date" name="fecha" value={editedTask.fecha} onChange={handleChange} />
          </label>
          <label>
            Cliente:
            <input type="text" name="cliente" value={editedTask.cliente} onChange={handleChange} />
          </label>
          <label>
            Campo:
            <input type="text" name="campo" value={editedTask.campo} onChange={handleChange} />
          </label>
          <label>
            Lote:
            <input type="text" name="lote" value={editedTask.lote} onChange={handleChange} />
          </label>
          <label>
            Tarea:
            <select name="tarea" value={editedTask.tarea} onChange={handleChange}>
              <option value="">Seleccionar</option>
              <option value="Fertilización">Fertilización</option>
              <option value="Siembra">Siembra</option>
              <option value="Fumigación">Fumigación</option>
              <option value="Cosecha">Cosecha</option>
            </select>
          </label>
          <label>
            Hectáreas:
            <input type="number" name="hectareas" value={editedTask.hectareas} onChange={handleChange} />
          </label>
          <label>
            Maquinaria:
            <input type="text" name="maquinaria" value={editedTask.maquinaria} onChange={handleChange} />
          </label>
          <label>
            Observaciones:
            <textarea name="observaciones" value={editedTask.observaciones} onChange={handleChange}></textarea>
          </label>
          <div className="form-group checkbox">
            <label>
              <input type="checkbox" name="facturado" checked={editedTask.facturado} onChange={handleChange} />
              Facturado
            </label>
            <label>
              <input type="checkbox" name="cobrado" checked={editedTask.cobrado} onChange={handleChange} />
              Cobrado
            </label>
          </div>
          <div className="modal-buttons">
            <button type="button" onClick={handleSave} className="save-btn">Guardar</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;

