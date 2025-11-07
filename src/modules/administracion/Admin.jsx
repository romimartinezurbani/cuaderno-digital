import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import "../../styles/admin.css";

const COLUMNAS_POR_DEFECTO = {
  tareas: [
    "fecha",
    "grupoEmpresarial",
    "cliente",
    "nroCliente",
    "cuit",
    "razonsocial",
    "condicionIva",
    "domicilio",
    "estancia",
    "provincia",
    "localidad",
    "ingenieroContacto",
    "coadyudante",
    "retencionHabitual",
    "tarea",
    "hectareas",
    "usdPorHa",
    "totalCobrar",
    "observaciones",
    "facturado",
    "cobrado",
  ],
  facturacion: [
    "numeroFactura",
    "fechaEmision",
    "vencimiento",
    "cliente",
    "cuit",
    "tarea",
    "monto",
    "estado",
  ],
  clientes: ["nombre", "cuit", "email", "telefono", "direccion"],
  administracion: ["nombre", "email", "rol", "fechaCreacion"],
};

const Admin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [moduloSeleccionado, setModuloSeleccionado] = useState("");
  const [columnasSeleccionadas, setColumnasSeleccionadas] = useState([]);

  const obtenerUsuarios = async () => {
    const querySnapshot = await getDocs(collection(db, "usuarios"));
    const listaUsuarios = querySnapshot.docs.map((docu) => ({
      id: docu.id,
      ...docu.data(),
    }));
    setUsuarios(listaUsuarios);
  };

  const actualizarUsuario = async (id, campo, valor) => {
    const userRef = doc(db, "usuarios", id);
    await updateDoc(userRef, { [campo]: valor });
    obtenerUsuarios();
  };

  const toggleModulo = async (id, modulo, valorActual) => {
    const userRef = doc(db, "usuarios", id);
    await updateDoc(userRef, {
      [`modulos.${modulo}`]: !valorActual,
    });
    obtenerUsuarios();
  };

  const abrirModal = (usuario, modulo) => {
    setUsuarioSeleccionado(usuario);
    setModuloSeleccionado(modulo);

    const actuales = usuario.columnas?.[modulo] || [];
    setColumnasSeleccionadas(actuales);
    setModalAbierto(true);
  };

  const guardarColumnas = async () => {
    if (!usuarioSeleccionado || !moduloSeleccionado) return;

    const userRef = doc(db, "usuarios", usuarioSeleccionado.id);
    await updateDoc(userRef, {
      [`columnas.${moduloSeleccionado}`]: columnasSeleccionadas,
    });

    setModalAbierto(false);
    setUsuarioSeleccionado(null);
    obtenerUsuarios();
  };

  const handleCheckboxChange = (columna) => {
    setColumnasSeleccionadas((prev) =>
      prev.includes(columna)
        ? prev.filter((c) => c !== columna)
        : [...prev, columna]
    );
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  return (
    <div className="admin-container">
      <h2>Panel de Administración</h2>
      <p>Gestioná accesos y columnas visibles de cada usuario.</p>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Tareas</th>
            <th>Facturación</th>
            <th>Clientes</th>
            <th>Administración</th>
            <th>Configurar columnas</th>
            <th>Aprobado</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.id}>
              <td>{user.nombre || "—"}</td>
              <td>{user.email}</td>
              <td>{user.rol}</td>

              <td>
                <input
                  type="checkbox"
                  checked={user.modulos?.tareas || false}
                  onChange={() =>
                    toggleModulo(user.id, "tareas", user.modulos?.tareas)
                  }
                />
              </td>

              <td>
                <input
                  type="checkbox"
                  checked={user.modulos?.facturacion || false}
                  onChange={() =>
                    toggleModulo(
                      user.id,
                      "facturacion",
                      user.modulos?.facturacion
                    )
                  }
                />
              </td>

              <td>
                <input
                  type="checkbox"
                  checked={user.modulos?.clientes || false}
                  onChange={() =>
                    toggleModulo(user.id, "clientes", user.modulos?.clientes)
                  }
                />
              </td>

              <td>
                <input
                  type="checkbox"
                  checked={user.modulos?.administracion || false}
                  onChange={() =>
                    toggleModulo(
                      user.id,
                      "administracion",
                      user.modulos?.administracion
                    )
                  }
                />
              </td>

              <td>
                <div className="column-config">
                  <button
                    className="btn-config"
                    onClick={() => abrirModal(user, "tareas")}
                  >
                    ⚙️ Tareas
                  </button>
                  <button
                    className="btn-config"
                    onClick={() => abrirModal(user, "facturacion")}
                  >
                    ⚙️ Facturación
                  </button>
                  <button
                    className="btn-config"
                    onClick={() => abrirModal(user, "clientes")}
                  >
                    ⚙️ Clientes
                  </button>
                </div>
              </td>

              <td>
                {user.rol === "pendiente" ? (
                  <button
                    className="btn-approve"
                    onClick={() => actualizarUsuario(user.id, "rol", "usuario")}
                  >
                    Aprobar
                  </button>
                ) : (
                  <span className="aprobado">✔</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Columnas visibles para {moduloSeleccionado}</h3>
            <div className="columnas-lista scrollable">
              {COLUMNAS_POR_DEFECTO[moduloSeleccionado].map((col) => (
                <label key={col} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={columnasSeleccionadas.includes(col)}
                    onChange={() => handleCheckboxChange(col)}
                  />
                  {col}
                </label>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn-approve" onClick={guardarColumnas}>
                Guardar
              </button>
              <button
                className="btn-cancel"
                onClick={() => setModalAbierto(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;







