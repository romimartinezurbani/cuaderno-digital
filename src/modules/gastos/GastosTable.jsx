import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where
} from "firebase/firestore";
import { db } from "../../firebase";
import "../../styles/table.css";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineCheck } from "react-icons/ai";
import { useAuth } from "../../context/AuthContext";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function GastosTable() {
  const { empresaId } = useAuth();

  const [gastos, setGastos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [filtros, setFiltros] = useState({ proveedor: "", moneda: "" });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (empresaId) loadData();
  }, [empresaId]);

  const loadData = async () => {
    /* 🔹 GASTOS de la empresa */
    const gastosQuery = query(
      collection(db, "gastos"),
      where("empresaId", "==", empresaId)
    );

    const gastosSnap = await getDocs(gastosQuery);
    const gastosData = gastosSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    setGastos(gastosData);
    setFiltered(gastosData);

    /* 🔹 PROVEEDORES de la empresa */
    const proveedoresQuery = query(
      collection(db, "proveedores"),
      where("empresaId", "==", empresaId)
    );

    const proveedoresSnap = await getDocs(proveedoresQuery);
    setProveedores(proveedoresSnap.docs.map(d => d.data().nombre));
  };

  const aplicarFiltros = () => {
    let data = [...gastos];

    if (filtros.proveedor)
      data = data.filter(g => g.proveedor === filtros.proveedor);

    if (filtros.moneda)
      data = data.filter(g => g.moneda === filtros.moneda);

    setFiltered(data);
  };

  useEffect(() => {
    aplicarFiltros();
  }, [filtros, gastos]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "gastos", id));
    loadData();
  };

  const handleSaveEdit = async () => {
    await updateDoc(doc(db, "gastos", editId), editData);
    setEditId(null);
    loadData();
  };

  const exportarExcel = () => {
  const data = filtered.map(g => ({
    Proveedor: g.proveedor,
    CUIT: g.cuit,
    Descripción: g.descripcion,
    Fecha: g.fecha,
    Moneda: g.moneda,
    Monto: g.monto,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Gastos");
  XLSX.writeFile(wb, "gastos.xlsx");
};

const exportarPDF = () => {
  const pdf = new jsPDF();
  pdf.text("Listado de Gastos", 14, 10);

  pdf.autoTable({
    head: [[
      "Proveedor",
      "CUIT",
      "Descripción",
      "Fecha",
      "Moneda",
      "Monto"
    ]],
    body: filtered.map(g => [
      g.proveedor,
      g.cuit,
      g.descripcion,
      g.fecha,
      g.moneda,
      `${g.moneda === "ARS" ? "$" : "USD"} ${g.monto}`
    ]),
    startY: 20,
  });

  pdf.save("gastos.pdf");
};


  return (
    <div className="table-container">
      <div className="table-header">
      <div className="filters">
        <select
          value={filtros.proveedor}
          onChange={(e) =>
            setFiltros({ ...filtros, proveedor: e.target.value })
          }
        >
          <option value="">Filtrar por proveedor</option>
          {proveedores.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <select
          value={filtros.moneda}
          onChange={(e) =>
            setFiltros({ ...filtros, moneda: e.target.value })
          }
        >
          <option value="">Moneda</option>
          <option value="USD">USD</option>
          <option value="ARS">$ Pesos</option>
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
            <th>Proveedor</th>
            <th>CUIT</th>
            <th>Descripción</th>
            <th>Fecha</th>
            <th>Moneda</th>
            <th>Monto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((row) => (
            <tr key={row.id}>
              <td>
                {editId === row.id ? (
                  <input
                    value={editData.proveedor}
                    onChange={(e) =>
                      setEditData({ ...editData, proveedor: e.target.value })
                    }
                  />
                ) : row.proveedor}
              </td>

              <td>
                {editId === row.id ? (
                  <input
                    value={editData.cuit}
                    onChange={(e) =>
                      setEditData({ ...editData, cuit: e.target.value })
                    }
                  />
                ) : row.cuit}
              </td>

              <td>
                {editId === row.id ? (
                  <input
                    value={editData.descripcion}
                    onChange={(e) =>
                      setEditData({ ...editData, descripcion: e.target.value })
                    }
                  />
                ) : row.descripcion}
              </td>

              <td>
                {editId === row.id ? (
                  <input
                    type="date"
                    value={editData.fecha}
                    onChange={(e) =>
                      setEditData({ ...editData, fecha: e.target.value })
                    }
                  />
                ) : row.fecha}
              </td>

              <td>
                {editId === row.id ? (
                  <select
                    value={editData.moneda}
                    onChange={(e) =>
                      setEditData({ ...editData, moneda: e.target.value })
                    }
                  >
                    <option value="USD">USD</option>
                    <option value="ARS">$ Pesos</option>
                  </select>
                ) : row.moneda}
              </td>

              <td>
                {editId === row.id ? (
                  <input
                    type="number"
                    value={editData.monto}
                    onChange={(e) =>
                      setEditData({ ...editData, monto: e.target.value })
                    }
                  />
                ) : `${row.moneda === "ARS" ? "$ " : "USD "}${row.monto}`}
              </td>

              <td>
                {editId === row.id ? (
                  <button className="btn-action" onClick={handleSaveEdit}>
                    <AiOutlineCheck />
                  </button>
                ) : (
                  <>
                    <button
                      className="btn-action"
                      onClick={() => {
                        setEditId(row.id);
                        setEditData(row);
                      }}
                    >
                      <AiOutlineEdit />
                    </button>
                    <button
                      className="btn-action"
                      onClick={() => handleDelete(row.id)}
                    >
                      <AiOutlineDelete />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
