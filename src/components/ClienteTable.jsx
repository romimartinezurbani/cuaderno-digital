import React, { useEffect, useState, useCallback } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import "../styles/table.css";

const ClienteTable = () => {
  const [clientes, setClientes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const { userData, currentUser } = useAuth();

  // ✅ Envolvemos la función en useCallback para evitar advertencias y dependencias erróneas
  const fetchClientes = useCallback(async () => {
    if (!currentUser) return;

    const q = query(collection(db, "clientes"), where("creadoPor", "==", currentUser.uid));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setClientes(data);
  }, [currentUser]);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]); // ✅ ahora la dependencia está bien manejada

  if (!userData?.modulos?.clientes) return null;

  const columnasVisibles = userData?.columnas?.clientes || [];

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

  const renderCelda = (cliente, campo) => {
    if (editId === cliente.id) {
      return (
        <td>
          <input
            name={campo}
            value={editedData[campo] || ""}
            onChange={handleChange}
          />
        </td>
      );
    }
    return <td>{cliente[campo]}</td>;
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>Listado de Clientes</h2>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            {columnasVisibles.includes("nombre") && <th>Nombre</th>}
            {columnasVisibles.includes("nroCliente") && <th>N° Cliente</th>}
            {columnasVisibles.includes("cuit") && <th>CUIT</th>}
            {columnasVisibles.includes("razonsocial") && <th>Razón Social</th>}
            {columnasVisibles.includes("condicionIva") && <th>Condición IVA</th>}
            {columnasVisibles.includes("domicilio") && <th>Domicilio</th>}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              {columnasVisibles.includes("nombre") && renderCelda(cliente, "nombre")}
              {columnasVisibles.includes("nroCliente") && renderCelda(cliente, "nroCliente")}
              {columnasVisibles.includes("cuit") && renderCelda(cliente, "cuit")}
              {columnasVisibles.includes("razonsocial") && renderCelda(cliente, "razonsocial")}
              {columnasVisibles.includes("condicionIva") && renderCelda(cliente, "condicionIva")}
              {columnasVisibles.includes("domicilio") && renderCelda(cliente, "domicilio")}
              <td>
                {editId === cliente.id ? (
                  <>
                    <button className="btn-action" onClick={() => handleSave(cliente.id)}>💾</button>
                    <button className="btn-action" onClick={() => setEditId(null)}>❌</button>
                  </>
                ) : (
                  <>
                    <button className="btn-action" onClick={() => handleEdit(cliente)}>✏️</button>
                    <button className="btn-action" onClick={() => handleDelete(cliente.id)}>🗑️</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClienteTable;



