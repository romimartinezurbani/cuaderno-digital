import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import '../styles/form.css';

const BillingForm = ({ onFacturaAgregada }) => {
  const { empresaId } = useAuth();

  const [clientes, setClientes] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [factura, setFactura] = useState({
    numero: '',
    fechaEmision: '',
    vencimiento: '',
    cliente: '',
    cuit: '',
    tareaId: '',
    monto: '',
    estado: 'pendiente',
  });

  useEffect(() => {
    if (!empresaId) return;

    const fetchClientesYTareas = async () => {
      const tareasQuery = query(
        collection(db, 'tareas'),
        where('empresaId', '==', empresaId)
      );

      const tareasSnapshot = await getDocs(tareasQuery);
      const tareasData = tareasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const clientesUnicos = [
        ...new Map(
          tareasData.map(t => [
            `${t.cliente}||${t.cuit}`,
            { nombre: t.cliente, cuit: t.cuit }
          ])
        ).values()
      ];

      setClientes(clientesUnicos);
      setTareas(tareasData);
    };

    fetchClientesYTareas();
  }, [empresaId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFactura(prev => ({ ...prev, [name]: value }));
  };

  const handleClienteChange = (e) => {
    const [nombre, cuit] = e.target.value.split('||');
    setFactura(prev => ({ ...prev, cliente: nombre, cuit }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, 'facturas'), {
      ...factura,
      empresaId, // 🔹 CLAVE
    });

    setFactura({
      numero: '',
      fechaEmision: '',
      vencimiento: '',
      cliente: '',
      cuit: '',
      tareaId: '',
      monto: '',
      estado: 'pendiente',
    });

    onFacturaAgregada && onFacturaAgregada();
  };

  const tareasFiltradas = tareas.filter(t => t.cliente === factura.cliente);

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>Cargar Factura</h2>

      <div className="form-group">
        <label>Número de Factura</label>
        <input name="numero" value={factura.numero} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Fecha de Emisión</label>
        <input type="date" name="fechaEmision" value={factura.fechaEmision} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Vencimiento</label>
        <input type="date" name="vencimiento" value={factura.vencimiento} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Cliente</label>
        <select onChange={handleClienteChange} required value={`${factura.cliente}||${factura.cuit}`}>
          <option value="">Seleccione un cliente</option>
          {clientes.map((c, i) => (
            <option key={i} value={`${c.nombre}||${c.cuit}`}>
              {c.nombre} ({c.cuit})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Tarea Asociada</label>
        <select name="tareaId" onChange={handleChange} value={factura.tareaId}>
          <option value="">Seleccione una tarea</option>
          {tareasFiltradas.map(t => (
            <option key={t.id} value={t.id}>
              {`${t.fecha} - ${t.tarea} (${t.lote})`}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Monto (USD)</label>
        <input type="number" name="monto" value={factura.monto} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Estado</label>
        <select name="estado" value={factura.estado} onChange={handleChange}>
          <option value="pendiente">Pendiente</option>
          <option value="cobrado">Cobrado</option>
        </select>
      </div>

      <button type="submit">Guardar Factura</button>
    </form>
  );
};

export default BillingForm;

