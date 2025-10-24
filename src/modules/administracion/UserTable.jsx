import React from "react";
import "../../styles/admin.css";

const UserTable = ({ usuarios, actualizarEstado }) => {
  return (
    <div className="user-table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Nombre</th>
            <th>Fecha de registro</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.nombre || "—"}</td>
              <td>
                {user.fechaCreacion
                  ? new Date(user.fechaCreacion.seconds * 1000).toLocaleDateString()
                  : "—"}
              </td>
              <td className={`estado-${user.estado}`}>{user.estado}</td>
              <td>
                {user.estado === "pendiente" ? (
                  <button
                    onClick={() => actualizarEstado(user.id, "activo")}
                    className="btn-aprobar"
                  >
                    Aprobar
                  </button>
                ) : (
                  <button
                    onClick={() => actualizarEstado(user.id, "pendiente")}
                    className="btn-bloquear"
                  >
                    Bloquear
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;

