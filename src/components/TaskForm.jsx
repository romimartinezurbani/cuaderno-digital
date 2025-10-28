import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/form.css";

const TaskForm = ({ onTaskAdded, usuarioId }) => {
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({
    fecha: "",
    grupoEmpresarial: "",
    cliente: "",
    nroCliente: "",
    cuit: "",
    razonsocial: "",
    condicionIva: "",
    domicilio: "",
    tarea: "",
    estancia: "",
    provincia: "",
    localidad: "",
    hectareas: "",
    usdPorHa: "",
    ingenieroContacto: "",
    coadyudante: "",
    retencionHabitual: "",
    totalCobrar: "",
    observaciones: "",
  });

  useEffect(() => {
    const fetchClientes = async () => {
      const querySnapshot = await getDocs(collection(db, "clientes"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClientes(data);
    };
    fetchClientes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Autocompletar datos del cliente seleccionado
    if (name === "cliente") {
      const clienteSel = clientes.find((c) => c.nombre === value);
      setFormData((prev) => ({
        ...prev,
        cliente: value,
        nroCliente: clienteSel?.nroCliente || "",
        cuit: clienteSel?.cuit || "",
        razonsocial: clienteSel?.razonsocial || "",
        condicionIva: clienteSel?.condicionIva || "",
        domicilio: clienteSel?.domicilio || "",
      }));
      return;
    }

    // Cálculo automático del total
    if (name === "hectareas" || name === "usdPorHa") {
      const hectareas = name === "hectareas" ? value : formData.hectareas;
      const usdPorHa = name === "usdPorHa" ? value : formData.usdPorHa;
      const total = (parseFloat(hectareas || 0) * parseFloat(usdPorHa || 0)).toFixed(2);
      setFormData((prev) => ({ ...prev, [name]: value, totalCobrar: total }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.cliente || !formData.tarea) {
      alert("Por favor complete los campos obligatorios.");
      return;
    }
    await addDoc(collection(db, "tareas"), {
      ...formData,
      usuarioId,
      createdAt: new Date(),
    });
    onTaskAdded();
    setFormData({
      fecha: "",
      grupoEmpresarial: "",
      cliente: "",
      nroCliente: "",
      cuit: "",
      razonsocial: "",
      condicionIva: "",
      domicilio: "",
      tarea: "",
      estancia: "",
      provincia: "",
      localidad: "",
      hectareas: "",
      usdPorHa: "",
      ingenieroContacto: "",
      coadyudante: "",
      retencionHabitual: "",
      totalCobrar: "",
      observaciones: "",
    });
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>Registrar Tarea</h2>

      <div className="form-grid-two">
        {/* Columna izquierda */}
        <div className="form-column">
          <div className="form-group">
            <label>Grupo Empresarial</label>
            <input
              type="text"
              name="grupoEmpresarial"
              value={formData.grupoEmpresarial}
              onChange={handleChange}
              placeholder="Ej: Grupo AgroSur"
            />
          </div>

          <div className="form-group">
            <label>Cliente</label>
            <select name="cliente" value={formData.cliente} onChange={handleChange}>
              <option value="">Seleccione cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.nombre}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>N° Cliente</label>
            <input
              type="text"
              name="nroCliente"
              value={formData.nroCliente}
              onChange={handleChange}
              placeholder="Número interno"
            />
          </div>

          <div className="form-group">
            <label>CUIT</label>
            <input
              type="text"
              name="cuit"
              value={formData.cuit}
              onChange={handleChange}
              placeholder="CUIT"
            />
          </div>

          <div className="form-group">
            <label>Razón Social</label>
            <input
              type="text"
              name="razonsocial"
              value={formData.razonsocial}
              onChange={handleChange}
              placeholder="Razón social"
            />
          </div>

          <div className="form-group">
            <label>Condición IVA</label>
            <input
              type="text"
              name="condicionIva"
              value={formData.condicionIva}
              onChange={handleChange}
              placeholder="Responsable Inscripto, Monotributo..."
            />
          </div>

          <div className="form-group">
            <label>Domicilio</label>
            <input
              type="text"
              name="domicilio"
              value={formData.domicilio}
              onChange={handleChange}
              placeholder="Dirección"
            />
          </div>
        </div>

        {/* Columna derecha */}
        <div className="form-column">
          <div className="form-group">
            <label>Fecha</label>
            <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Tarea</label>
            <input
              type="text"
              name="tarea"
              value={formData.tarea}
              onChange={handleChange}
              placeholder="Tipo de tarea"
            />
          </div>

          <div className="form-group">
            <label>Estancia</label>
            <input
              type="text"
              name="estancia"
              value={formData.estancia}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Provincia</label>
            <input
              type="text"
              name="provincia"
              value={formData.provincia}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Localidad</label>
            <input
              type="text"
              name="localidad"
              value={formData.localidad}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Ingeniero contacto</label>
            <input
              type="text"
              name="ingenieroContacto"
              value={formData.ingenieroContacto}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Coadyudante</label>
            <input
              type="text"
              name="coadyudante"
              value={formData.coadyudante}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Retención habitual (%)</label>
            <input
              type="number"
              name="retencionHabitual"
              value={formData.retencionHabitual}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Hectáreas</label>
            <input
              type="number"
              name="hectareas"
              value={formData.hectareas}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>USD por ha</label>
            <input
              type="number"
              name="usdPorHa"
              value={formData.usdPorHa}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Total a cobrar (USD)</label>
            <input type="text" name="totalCobrar" value={formData.totalCobrar} readOnly />
          </div>
        </div>
      </div>

      <div className="form-group full-width">
        <label>Observaciones</label>
        <textarea
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
        />
      </div>

      <button type="submit">Guardar</button>
    </form>
  );
};

export default TaskForm;



