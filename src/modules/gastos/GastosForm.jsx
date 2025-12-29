import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "../../styles/form.css";


export default function GastosForm({ onSave }) {
const [clientes, setClientes] = useState([]);
const [formData, setFormData] = useState({
cliente: "",
cuit: "",
descripcion: "",
fecha: "",
moneda: "USD",
monto: "",
});


useEffect(() => {
const fetchClientes = async () => {
const snap = await getDocs(collection(db, "clientes"));
setClientes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
};
fetchClientes();
}, []);


const handleClienteChange = (nombre) => {
const selected = clientes.find((c) => c.nombre === nombre);
setFormData({
...formData,
cliente: nombre,
cuit: selected?.cuit || "",
});
};


const handleSubmit = async (e) => {
e.preventDefault();
await addDoc(collection(db, "gastos"), formData);
if (onSave) onSave();
setFormData({ cliente: "", cuit: "", descripcion: "", fecha: "", moneda: "USD", monto: "" });
};

return (
<form className="task-form" onSubmit={handleSubmit}>
<h2>Registrar Gasto</h2>
<div className="form-grid-two">


<div className="form-column">
<div className="form-group">
<label>Cliente</label>
<select value={formData.cliente} onChange={(e) => handleClienteChange(e.target.value)}>
<option value="">Seleccionar...</option>
{clientes.map((c) => (
<option key={c.id} value={c.nombre}>{c.nombre}</option>
))}
</select>
</div>


<div className="form-group">
<label>CUIT</label>
<input type="text" value={formData.cuit} onChange={(e) => setFormData({ ...formData, cuit: e.target.value })} />
</div>


<div className="form-group">
<label>Fecha</label>
<input type="date" value={formData.fecha} onChange={(e) => setFormData({ ...formData, fecha: e.target.value })} />
</div>
</div>


<div className="form-column">
<div className="form-group">
<label>Descripción</label>
<textarea value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} />
</div>


<div className="form-group">
<label>Moneda</label>
<select value={formData.moneda} onChange={(e) => setFormData({ ...formData, moneda: e.target.value })}>
<option value="USD">USD</option>
<option value="ARS">$ Pesos</option>
</select>
</div>


<div className="form-group">
<label>Monto</label>
<input type="number" value={formData.monto} onChange={(e) => setFormData({ ...formData, monto: e.target.value })} />
</div>
</div>
</div>


<button type="submit">Guardar Gasto</button>
</form>
);
}

