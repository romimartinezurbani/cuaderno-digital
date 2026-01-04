import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import ContactoForm from "./ContactoForm";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import "../styles/table.css";
import "../styles/form.css";

const ContactosDashboard = () => {
  const { userData } = useAuth();

  const [contactos, setContactos] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchContactos = async () => {
    if (!userData?.empresaId) return;

    const q = query(
      collection(db, "contactos"),
      where("empresaId", "==", userData.empresaId)
    );

    const snap = await getDocs(q);
    setContactos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchContactos();
  }, [userData?.empresaId]);

  const contactosFiltrados = contactos.filter(c => {
    const matchNombre = c.nombre?.toLowerCase().includes(filtroNombre.toLowerCase());
    const matchTipo = filtroTipo ? c.tipo === filtroTipo : true;
    return matchNombre && matchTipo;
  });

  const handleEliminar = async (id) => {
    if (window.confirm("¿Eliminar registro?")) {
      await deleteDoc(doc(db, "contactos", id));
      fetchContactos();
    }
  };

  const handleEditar = (c) => {
    setEditandoId(c.id);
    setEditData({ ...c });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    await updateDoc(doc(db, "contactos", editandoId), editData);
    setEditandoId(null);
    setEditData({});
    fetchContactos();
  };

  const exportarExcel = () => {
  const data = contactosFiltrados.map(c => ({
    Tipo: c.tipo,
    Nombre: c.nombre,
    CUIT: c.cuit,
    Número: c.nro,
    "Razón Social": c.razonSocial,
    "Condición IVA": c.condicionIva,
    Domicilio: c.domicilio,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Contactos");
  XLSX.writeFile(wb, "contactos.xlsx");
};

const exportarPDF = () => {
  const pdf = new jsPDF();

  pdf.text("Listado de Contactos", 14, 10);

  pdf.autoTable({
    head: [[
      "Tipo",
      "Nombre",
      "CUIT",
      "N°",
      "Razón Social",
      "Condición IVA",
      "Domicilio"
    ]],
    body: contactosFiltrados.map(c => [
      c.tipo,
      c.nombre,
      c.cuit,
      c.nro,
      c.razonSocial,
      c.condicionIva,
      c.domicilio,
    ]),
    startY: 20,
  });

  pdf.save("contactos.pdf");
};


  return (
  <div>
    <ContactoForm onContactoAgregado={fetchContactos} />

    <div className="table-container">
      <div className="table-header">
        <div className="filters">
          <input
            placeholder="Filtrar por nombre"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />

          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="cliente">Clientes</option>
            <option value="proveedor">Proveedores</option>
          </select>
        </div>

        <div className="export-buttons">
          <button onClick={exportarExcel}>📊 Excel</button>
          <button onClick={exportarPDF}>📄 PDF</button>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Nombre</th>
            <th>CUIT</th>
            <th>N°</th>
            <th>Razón Social</th>
            <th>Condición IVA</th>
            <th>Domicilio</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {contactosFiltrados.map(c => (
            <tr key={c.id}>
              {editandoId === c.id ? (
                <>
                  <td>
                    <select name="tipo" value={editData.tipo} onChange={handleChange}>
                      <option value="cliente">Cliente</option>
                      <option value="proveedor">Proveedor</option>
                    </select>
                  </td>
                  <td><input name="nombre" value={editData.nombre} onChange={handleChange} /></td>
                  <td><input name="cuit" value={editData.cuit} onChange={handleChange} /></td>
                  <td><input name="nro" value={editData.nro} onChange={handleChange} /></td>
                  <td><input name="razonSocial" value={editData.razonSocial} onChange={handleChange} /></td>
                  <td><input name="condicionIva" value={editData.condicionIva} onChange={handleChange} /></td>
                  <td><input name="domicilio" value={editData.domicilio} onChange={handleChange} /></td>
                  <td>
                    <button onClick={handleGuardar}>💾</button>
                    <button onClick={() => setEditandoId(null)}>✖</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{c.tipo}</td>
                  <td>{c.nombre}</td>
                  <td>{c.cuit}</td>
                  <td>{c.nro}</td>
                  <td>{c.razonSocial}</td>
                  <td>{c.condicionIva}</td>
                  <td>{c.domicilio}</td>
                  <td>
                    <button className="btn-action" onClick={() => handleEditar(c)}>✏️</button>
                    <button className="btn-action" onClick={() => handleEliminar(c.id)}>🗑️</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
}

export default ContactosDashboard;





