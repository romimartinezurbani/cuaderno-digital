// src/components/TaskFilters.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/filters.css';

const TaskFilters = ({ filters, setFilters }) => {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const fetchClientes = async () => {
      const querySnapshot = await getDocs(collection(db, 'clientes'));
      const nombresUnicos = [...new Set(querySnapshot.docs.map(doc => doc.data().nombre))];
      setClientes(nombresUnicos);
    };

    fetchClientes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="task-filters">
      <select name="cliente" value={filters.cliente} onChange={handleChange}>
        <option value="">Todos los clientes</option>
        {clientes.map((cliente, i) => (
          <option key={i} value={cliente}>
            {cliente}
          </option>
        ))}
      </select>

      <select name="tarea" value={filters.tarea} onChange={handleChange}>
        <option value="">Todas las tareas</option>
        <option value="Fertilización">Fertilización</option>
        <option value="Siembra">Siembra</option>
        <option value="Fumigación">Fumigación</option>
        <option value="Cosecha">Cosecha</option>
      </select>
    </div>
  );
};

export default TaskFilters;
