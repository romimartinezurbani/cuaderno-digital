import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import "../../styles/form.css";

export default function GastosForm({ onSave }) {
  const { userData } = useAuth();

  const [proveedores, setProveedores] = useState([]);
  const [formData, setFormData] = useState({
    proveedor: "",
    cuit: "",
    descripcion: "",
    fecha: "",
    moneda: "USD",
    monto: "",
  });

  useEffect(() => {
    const fetchProveedores = async () => {
      const snap = await getDocs(collection(db, "proveedores"));
      setProveedores(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchProveedores();
  }, []);

  const handleProveedoresChange = (nombre) => {
    const selected = proveedores.find((p) => p.nombre === nombre);
    setFormData((prev) => ({
      ...prev,
      proveedor: nombre,
      cuit: selected?.cuit || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "gastos"), {
      ...formData,
      empresaId: userData.empresaId, // 🔑 filtro por empresa
      createdAt: new Date(),
    });

    if (onSave) onSave();

    setFormData({
      proveedor: "",
      cuit: "",
      descripcion: "",
      fecha: "",
      moneda: "USD",
      monto: "",
    });
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>Registrar Gasto</h2>

      <div className="form-grid-two">
        <div className="form-column">
          <div className="form-group">
            <label>Proveedor</label>
            <select
              value={formData.proveedor}
              onChange={(e) => handleProveedoresChange(e.target.value)}
            >
              <option value="">Seleccionar...</option>
              {proveedores.map((p) => (
                <option key={p.id} value={p.nombre}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>CUIT</label>
            <input type="text" value={formData.cuit} readOnly />
          </div>

          <div className="form-group">
            <label>Fecha</label>
            <input
              type="date"
              value={formData.fecha}
              onChange={(e) =>
                setFormData({ ...formData, fecha: e.target.value })
              }
            />
          </div>
        </div>

        <div className="form-column">
          <div className="form-group">
            <label>Descripción</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Moneda</label>
            <select
              value={formData.moneda}
              onChange={(e) =>
                setFormData({ ...formData, moneda: e.target.value })
              }
            >
              <option value="USD">USD</option>
              <option value="ARS">$</option>
            </select>
          </div>

          <div className="form-group">
            <label>Monto</label>
            <input
              type="number"
              value={formData.monto}
              onChange={(e) =>
                setFormData({ ...formData, monto: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      <button type="submit">Guardar Gasto</button>
    </form>
  );
}

