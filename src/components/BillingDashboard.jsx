// src/components/BillingDashboard.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import BillingForm from './BillingForm';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../styles/table.css';
import '../styles/form.css';

const BillingDashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchInvoices = async () => {
    const querySnapshot = await getDocs(collection(db, 'facturas'));
    const fetchedInvoices = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setInvoices(fetchedInvoices);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const clientesUnicos = [
    ...new Map(invoices.map(i => [`${i.cliente}||${i.cuit}`, { cliente: i.cliente, cuit: i.cuit }])).values(),
  ];

  const facturasFiltradas = invoices.filter(f => {
    const coincideCliente = !filtroCliente || `${f.cliente}||${f.cuit}` === filtroCliente;
    const coincideEstado = !filtroEstado || f.estado === filtroEstado;
    return coincideCliente && coincideEstado;
  });

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro que deseas eliminar esta factura?')) {
      await deleteDoc(doc(db, 'facturas', id));
      fetchInvoices();
    }
  };

  const handleEditar = (factura) => {
    setEditandoId(factura.id);
    setEditData({ ...factura });
  };

  const handleEditarChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardarEdicion = async () => {
    const facturaRef = doc(db, 'facturas', editandoId);
    await updateDoc(facturaRef, editData);
    setEditandoId(null);
    setEditData({});
    fetchInvoices();
  };

  const exportarExcel = () => {
    const data = facturasFiltradas.map(f => ({
      'N° Factura': f.numero,
      Cliente: `${f.cliente} (${f.cuit})`,
      'Fecha Emisión': f.fechaEmision,
      Vencimiento: f.vencimiento,
      'Monto (USD)': f.monto,
      'Tarea Asociada': f.tareaId,
      Estado: f.estado === 'cobrado' ? 'Cobrado' : 'Pendiente',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Facturas');
    XLSX.writeFile(workbook, 'facturas.xlsx');
  };

  const exportarPDF = () => {
    const docPDF = new jsPDF();
    docPDF.text('Facturas Registradas', 14, 10);
    const tableData = facturasFiltradas.map(f => [
      f.numero,
      `${f.cliente} (${f.cuit})`,
      f.fechaEmision,
      f.vencimiento,
      f.monto,
      f.tareaId,
      f.estado === 'cobrado' ? 'Cobrado' : 'Pendiente',
    ]);

    docPDF.autoTable({
      head: [['N° Factura', 'Cliente', 'Fecha Emisión', 'Vencimiento', 'Monto (USD)', 'Tarea', 'Estado']],
      body: tableData,
      startY: 20,
    });

    docPDF.save('facturas.pdf');
  };

  return (
    <div>
      <BillingForm onFacturaAgregada={fetchInvoices} />

      <div className="task-table-container" style={{ padding: '2rem' }}>
        <h2 style={{ color: 'var(--color-principal)', marginBottom: '1rem' }}>Facturas registradas</h2>

        <div className="filtros-container" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
          <div className="form-group">
            <label>Cliente</label>
            <select value={filtroCliente} onChange={e => setFiltroCliente(e.target.value)}>
              <option value="">Todos los clientes</option>
              {clientesUnicos.map((c, i) => (
                <option key={i} value={`${c.cliente}||${c.cuit}`}>
                  {c.cliente} ({c.cuit})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Estado</label>
            <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="cobrado">Cobrado</option>
            </select>
          </div>

          <button className="btn" onClick={exportarExcel}>📊 Exportar a Excel</button>
          <button className="btn" onClick={exportarPDF}>📄 Exportar a PDF</button>
        </div>

        <table className="task-table">
          <thead>
            <tr>
              <th>N° Factura</th>
              <th>Cliente (CUIT)</th>
              <th>Fecha Emisión</th>
              <th>Vencimiento</th>
              <th>Monto (USD)</th>
              <th>Tarea</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {facturasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="8">No hay facturas que coincidan con los filtros.</td>
              </tr>
            ) : (
              facturasFiltradas.map((f) => (
                <tr key={f.id}>
                  {editandoId === f.id ? (
                    <>
                      <td><input name="numero" value={editData.numero} onChange={handleEditarChange} /></td>
                      <td>{f.cliente} ({f.cuit})</td>
                      <td><input type="date" name="fechaEmision" value={editData.fechaEmision} onChange={handleEditarChange} /></td>
                      <td><input type="date" name="vencimiento" value={editData.vencimiento} onChange={handleEditarChange} /></td>
                      <td><input name="monto" value={editData.monto} onChange={handleEditarChange} /></td>
                      <td>{f.tareaId}</td>
                      <td>
                        <select name="estado" value={editData.estado} onChange={handleEditarChange}>
                          <option value="pendiente">Pendiente</option>
                          <option value="cobrado">Cobrado</option>
                        </select>
                      </td>
                      <td>
                        <button onClick={handleGuardarEdicion}>💾</button>
                        <button onClick={() => setEditandoId(null)}>✖</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{f.numero}</td>
                      <td>{f.cliente} ({f.cuit})</td>
                      <td>{f.fechaEmision}</td>
                      <td>{f.vencimiento}</td>
                      <td>{f.monto}</td>
                      <td>{f.tareaId}</td>
                      <td>{f.estado === 'cobrado' ? 'Cobrado' : 'Pendiente'}</td>
                      <td>
                        <button onClick={() => handleEditar(f)}>✏️</button>
                        <button onClick={() => handleEliminar(f.id)}>🗑️</button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillingDashboard;


