import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import "../../styles/admin.css";

const Admin = () => {
  const [usuarios, setUsuarios] = useState([]);

  // 🔹 Obtener lista de usuarios
  const obtenerUsuarios = async () => {
    const querySnapshot = await getDocs(collection(db, "usuarios"));
    const listaUsuarios = querySnapshot.docs.map((docu) => ({
      id: docu.id,
      ...docu.data(),
    }));
    setUsuarios(listaUsuarios);
  };

  // 🔹 Actualizar rol o permisos
  const actualizarUsuario = async (id, campo, valor) => {
    const userRef = doc(db, "usuarios", id);
    await updateDoc(userRef, { [campo]: valor });
    obtenerUsuarios();
  };

  // 🔹 Cambiar acceso a módulos
  const toggleModulo = async (id, modulo, valorActual) => {
    const userRef = doc(db, "usuarios", id);
    await updateDoc(userRef, {
      [`modulos.${modulo}`]: !valorActual,
    });
    obtenerUsuarios();
  };

  // 🔹 Editar columnas visibles por módulo
  const editarColumnas = async (id, modulo) => {
    const columnasActuales =
      usuarios.find((u) => u.id === id)?.columnas?.[modulo]?.join(", ") || "";
    const columnas = prompt(
      `Ingresá las columnas visibles para el módulo "${modulo}" (separadas por coma):`,
      columnasActuales
    );
    if (!columnas) return;

    const userRef = doc(db, "usuarios", id);
    await updateDoc(userRef, {
      [`columnas.${modulo}`]: columnas
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c !== ""),
    });
    obtenerUsuarios();
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  return (
    <div className="admin-container">
      <h2>Panel de Administración</h2>
      <p>Gestioná los accesos y columnas visibles de cada usuario.</p>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Clientes</th>
            <th>Tareas</th>
            <th>Facturación</th>
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

              {/* 🔹 Módulos habilitados */}
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
                    toggleModulo(user.id, "facturacion", user.modulos?.facturacion)
                  }
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={user.modulos?.administracion || false}
                  onChange={() =>
                    toggleModulo(user.id, "administracion", user.modulos?.administracion)
                  }
                />
              </td>

              {/* 🔹 Configurar columnas */}
              <td>
                <div className="column-config">
                  <button
                    className="btn-config"
                    onClick={() => editarColumnas(user.id, "tareas")}
                  >
                    ⚙️ Tareas
                  </button>
                  <button
                    className="btn-config"
                    onClick={() => editarColumnas(user.id, "facturacion")}
                  >
                    ⚙️ Facturación
                  </button>
                </div>
              </td>

              {/* 🔹 Aprobar usuario */}
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
    </div>
  );
};

export default Admin;




