// src/components/ClientInput.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ClientInput = ({ onSelectClient }) => {
  const [clientes, setClientes] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchClientes = async () => {
      const snapshot = await getDocs(collection(db, 'clientes'));
      const nombres = snapshot.docs.map(doc => doc.data().nombre);
      setClientes(nombres);
    };

    fetchClientes();
  }, []);

  const handleChange = async (e) => {
    const value = e.target.value;
    setInputValue(value);
    setSuggestions(
      clientes.filter((cliente) =>
        cliente.toLowerCase().includes(value.toLowerCase())
      )
    );
    onSelectClient(value);
  };

  const handleSelect = (nombre) => {
    setInputValue(nombre);
    setSuggestions([]);
    onSelectClient(nombre);
  };

  const handleBlur = async () => {
    const trimmed = inputValue.trim();
    if (trimmed && !clientes.includes(trimmed)) {
      // Guardar nuevo cliente en Firebase
      try {
        await addDoc(collection(db, 'clientes'), { nombre: trimmed });
        setClientes((prev) => [...prev, trimmed]);
        console.log('Cliente agregado:', trimmed);
      } catch (error) {
        console.error('Error al agregar cliente:', error);
      }
    }
  };

  return (
    <div className="client-input" style={{ position: 'relative' }}>
      <input
        type="text"
        name="cliente"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Escribí el nombre del cliente"
        autoComplete="off"
        required
      />
      {suggestions.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            background: 'white',
            border: '1px solid #ccc',
            borderTop: 'none',
            zIndex: 10,
            maxHeight: '150px',
            overflowY: 'auto',
            padding: 0,
            margin: 0,
            listStyle: 'none',
          }}
        >
          {suggestions.map((s, index) => (
            <li
              key={index}
              onMouseDown={() => handleSelect(s)} // importante usar onMouseDown para evitar pérdida del foco antes de setear
              style={{
                padding: '8px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
              }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClientInput;

