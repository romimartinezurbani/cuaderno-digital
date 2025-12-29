import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "../../styles/table.css";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineCheck } from "react-icons/ai";


export default function GastosTable() {
const [gastos, setGastos] = useState([]);
const [filtered, setFiltered] = useState([]);
const [clientes, setClientes] = useState([]);
const [filtros, setFiltros] = useState({ cliente: "", moneda: "" });
const [editId, setEditId] = useState(null);
const [editData, setEditData] = useState({});


useEffect(() => {
loadData();
}, []);


const loadData = async () => {
const gastosSnap = await getDocs(collection(db, "gastos"));
const gastosData = gastosSnap.docs.map(d => ({ id: d.id, ...d.data() }));
setGastos(gastosData);
setFiltered(gastosData);


const clientesSnap = await getDocs(collection(db, "clientes"));
setClientes(clientesSnap.docs.map(d => d.data().nombre));
};


const aplicarFiltros = () => {
let data = [...gastos];
if (filtros.cliente) data = data.filter(g => g.cliente === filtros.cliente);
if (filtros.moneda) data = data.filter(g => g.moneda === filtros.moneda);
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

return (
<div className="table-container">
<div className="table-header">
<div className="filters">
<select value={filtros.cliente} onChange={(e) => setFiltros({ ...filtros, cliente: e.target.value })}>
<option value="">Filtrar por cliente</option>
{clientes.map((c) => <option key={c} value={c}>{c}</option>)}
</select>


<select value={filtros.moneda} onChange={(e) => setFiltros({ ...filtros, moneda: e.target.value })}>
<option value="">Moneda</option>
<option value="USD">USD</option>
<option value="ARS">$ Pesos</option>
</select>
</div>
</div>


<table className="data-table">
<thead>
<tr>
<th>Cliente</th>
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
{/* CLIENTE */}
<td>
{editId === row.id ? (
<input value={editData.cliente} onChange={(e) => setEditData({ ...editData, cliente: e.target.value })} />
) : row.cliente}
</td>
{/* CUIT */}
<td>
{editId === row.id ? (
<input value={editData.cuit} onChange={(e) => setEditData({ ...editData, cuit: e.target.value })} />
) : row.cuit}
</td>


{/* DESCRIPCION */}
<td>
{editId === row.id ? (
<input value={editData.descripcion} onChange={(e) => setEditData({ ...editData, descripcion: e.target.value })} />
) : row.descripcion}
</td>


{/* FECHA */}
<td>
{editId === row.id ? (
<input type="date" value={editData.fecha} onChange={(e) => setEditData({ ...editData, fecha: e.target.value })} />
) : row.fecha}
</td>


{/* MONEDA */}
<td>
{editId === row.id ? (
<select value={editData.moneda} onChange={(e) => setEditData({ ...editData, moneda: e.target.value })}>
<option value="USD">USD</option>
<option value="ARS">$ Pesos</option>
</select>
) : row.moneda}
</td>
{/* MONTO */}
<td>
{editId === row.id ? (
<input type="number" value={editData.monto} onChange={(e) => setEditData({ ...editData, monto: e.target.value })} />
) : (
`${row.moneda === "ARS" ? "$ " : "USD "}${row.monto}`
)}
</td>


<td>
{editId === row.id ? (
<button className="btn-action" onClick={handleSaveEdit}><AiOutlineCheck /></button>
) : (
<>
<button className="btn-action" onClick={() => { setEditId(row.id); setEditData(row); }}><AiOutlineEdit /></button>
<button className="btn-action" onClick={() => handleDelete(row.id)}><AiOutlineDelete /></button>
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