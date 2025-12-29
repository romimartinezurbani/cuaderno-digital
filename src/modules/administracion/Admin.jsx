import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import UserTable from "./UserTable";
import ColumnConfigModal from "./ColumnConfigModal";
import { MODULOS } from "../../config/modulos";
import "../../styles/admin.css";

const Admin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [moduloSeleccionado, setModuloSeleccionado] = useState("");
  const [columnasSeleccionadas, setColumnasSeleccionadas] = useState([]);

  const obtenerUsuarios = async () => {
    const snapshot = await getDocs(collection(db, "usuarios"));
    setUsuarios(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const toggleModulo = async (usuario, modulo) => {
  const modulosActuales = usuario.modulos || {};

  const modulosNormalizados = {};

  MODULOS.forEach((m) => {
    if (!m.key) return;

    modulosNormalizados[m.key] =
      m.key === modulo
        ? !Boolean(modulosActuales[m.key])
        : Boolean(modulosActuales[m.key]);
  });

  await updateDoc(doc(db, "usuarios", usuario.id), {
    modulos: modulosNormalizados,
  });

  obtenerUsuarios();
};

  const aprobarUsuario = async (id) => {
    await updateDoc(doc(db, "usuarios", id), { rol: "usuario" });
    obtenerUsuarios();
  };

  const abrirModal = (usuario, modulo) => {
    setUsuarioSeleccionado(usuario);
    setModuloSeleccionado(modulo);
    setColumnasSeleccionadas(usuario.columnas?.[modulo] || []);
    setModalAbierto(true);
  };

  const guardarColumnas = async () => {
    await updateDoc(doc(db, "usuarios", usuarioSeleccionado.id), {
      [`columnas.${moduloSeleccionado}`]: columnasSeleccionadas,
    });
    setModalAbierto(false);
    obtenerUsuarios();
  };

  const toggleColumna = (col) => {
    setColumnasSeleccionadas((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  return (
    <div className="admin-container">
      <h2>Panel de Administración</h2>
      <p>Gestioná accesos y columnas visibles de cada usuario.</p>

      <UserTable
        usuarios={usuarios}
        onToggleModulo={toggleModulo}
        onAprobarUsuario={aprobarUsuario}
        onConfigurarColumnas={abrirModal}
      />

      {modalAbierto && (
        <ColumnConfigModal
          modulo={moduloSeleccionado}
          columnasSeleccionadas={columnasSeleccionadas}
          onToggleColumna={toggleColumna}
          onGuardar={guardarColumnas}
          onCerrar={() => setModalAbierto(false)}
        />
      )}
    </div>
  );
};

export default Admin;








