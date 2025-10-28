import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/table.css";

const ClienteTable = () => {
  const [clientes, setClientes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedData, setEditedData] = useState({});

  const fetchClientes = async () => {
    const querySnapshot = await getDocs(collection(db, "clientes"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setClientes(data);
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Desea eliminar este cliente?")) {
      await deleteDoc(doc(db, "clientes", id));
      fetchClientes();
    }
  };

  const handleEdit = (cliente) => {
    setEditId(cliente.id);
    setEditedData(cliente);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (id) => {
    await updateDoc(doc(db, "clientes", id), editedData);
    setEditId(null);
    fetchClientes();
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>Listado de Clientes</h2>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>N° Cliente</th>
            <th>CUIT</th>
            <th>Razón Social</th>
            <th>Condición IVA</th>
            <th>Domicilio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              {editId === cliente.id ? (
                <>
                  <td><input name="nombre" value={editedData.nombre} onChange={handleChange} /></td>
                  <td><input name="nroCliente" value={editedData.nroCliente} onChange={handleChange} /></td>
                  <td><input name="cuit" value={editedData.cuit} onChange={handleChange} /></td>
                  <td><input name="razonsocial" value={editedData.razonsocial} onChange={handleChange} /></td>
                  <td><input name="condicionIva" value={editedData.condicionIva} onChange={handleChange} /></td>
                  <td><input name="domicilio" value={editedData.domicilio} onChange={handleChange} /></td>
                  <td>
                    <button className="btn-action" onClick={() => handleSave(cliente.id)}>💾</button>
                    <button className="btn-action" onClick={() => setEditId(null)}>❌</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.nroCliente}</td>
                  <td>{cliente.cuit}</td>
                  <td>{cliente.razonsocial}</td>
                  <td>{cliente.condicionIva}</td>
                  <td>{cliente.domicilio}</td>
                  <td>
                    <button className="btn-action" onClick={() => handleEdit(cliente)}>✏️</button>
                    <button className="btn-action" onClick={() => handleDelete(cliente.id)}>🗑️</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClienteTable;

