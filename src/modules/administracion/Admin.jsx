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

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  return (
    <div className="admin-container">
      <h2>Panel de Administración</h2>
      <p>Gestioná los accesos de los usuarios al sistema.</p>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Tareas</th>
            <th>Facturación</th>
            <th>Administración</th>
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



