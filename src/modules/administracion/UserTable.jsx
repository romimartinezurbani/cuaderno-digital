import React from "react";
import "../../styles/admin.css";

const UserTable = ({
  usuarios,
  onToggleModulo,
  onAprobarUsuario,
  onConfigurarColumnas,
}) => {
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Tareas</th>
          <th>Facturación</th>
          <th>Contactos</th>
          <th>Gastos</th>
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

            {["tareas", "facturacion", "contactos", "gastos", "administracion"].map(
                (mod) => (
                  <td key={mod}>
                    <input
                      type="checkbox"
                      checked={!!user.modulos?.[mod]}
                      onChange={() => onToggleModulo(user, mod)}
                    />
                  </td>
                )
              )}

            <td>
              <div className="column-config">
                {["tareas", "facturacion", "gastos", "contactos"].map((mod) => (
                  <button
                    key={mod}
                    className="btn-config"
                    onClick={() => onConfigurarColumnas(user, mod)}
                  >
                    ⚙️ {mod}
                  </button>
                ))}
              </div>
            </td>

            <td>
              {user.rol === "pendiente" ? (
                <button
                  className="btn-approve"
                  onClick={() => onAprobarUsuario(user.id)}
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
  );
};

export default UserTable;


