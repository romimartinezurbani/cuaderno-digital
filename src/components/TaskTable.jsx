import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import TaskFilters from "../components/TaskFilters";
import EditTaskModal from "./EditTaskModal";
import "../styles/table.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const TaskTable = ({ permisos }) => {
  const { empresaId } = useAuth(); // 🔑
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ cliente: "", tarea: "" });
  const [taskToEdit, setTaskToEdit] = useState(null);

  const [visibleCols, setVisibleCols] = useState(
    permisos?.tareas?.columnas || {
      Fecha: true,
      GrupoEmpresarial: true,
      Cliente: true,
      NroCliente: true,
      CUIT: true,
      RazonSocial: true,
      CondicionIVA: true,
      Domicilio: true,
      Tarea: true,
      Estancia: true,
      Provincia: true,
      Localidad: true,
      Hectareas: true,
      usdPorHa: true,
      IngenieroContacto: true,
      Coadyudante: true,
      RetencionHabitual: true,
      TotalCobrar: true,
      Observaciones: true,
    }
  );

  // 🔄 Cargar tareas por empresa
  useEffect(() => {
    if (!empresaId) return;

    const fetchTasks = async () => {
      try {
        const q = query(
          collection(db, "tareas"),
          where("empresaId", "==", empresaId)
        );

        const snap = await getDocs(q);
        const fetched = snap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((task) => !task.eliminado);

        setTasks(fetched);
      } catch (error) {
        console.error("Error al obtener tareas:", error);
      }
    };

    fetchTasks();
  }, [empresaId]);

  useEffect(() => {
    if (permisos?.tareas?.columnas) {
      setVisibleCols(permisos.tareas.columnas);
    }
  }, [permisos]);

  // 🔍 Filtros
  const filteredTasks = tasks.filter((task) => {
    const clienteMatch =
      !filters.cliente ||
      task.cliente?.toLowerCase().includes(filters.cliente.toLowerCase());

    const tareaMatch =
      !filters.tarea ||
      task.tarea?.toLowerCase().includes(filters.tarea.toLowerCase());

    return clienteMatch && tareaMatch;
  });

  // ✏️ Editar
  const handleEditClick = (task) => setTaskToEdit(task);

  const handleSaveTask = async (updatedTask) => {
    const { id, ...data } = updatedTask; // 🔑 SACAR ID

    await updateDoc(doc(db, "tareas", id), data);

    setTasks((prev) =>
      prev.map((task) => (task.id === id ? updatedTask : task))
    );

    setTaskToEdit(null);
  };

  // 🗑️ Soft delete
  const handleDeleteClick = async (taskId) => {
    if (!window.confirm("¿Eliminar esta tarea?")) return;

    await updateDoc(doc(db, "tareas", taskId), { eliminado: true });

    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  // 📤 Excel
  const exportToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((task) => {
        const row = {};
        Object.entries(visibleCols).forEach(([key, visible]) => {
          if (visible) row[key] = task[key] || "";
        });
        return row;
      })
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "Tareas");
    XLSX.writeFile(wb, "reporte_tareas.xlsx");
  };

  // 📄 PDF
  const exportToPDF = (data) => {
    const docPDF = new jsPDF();
    docPDF.text("Reporte de Tareas", 14, 16);

    const headers = [];
    const fields = [];

    Object.entries(visibleCols).forEach(([key, visible]) => {
      if (visible) {
        headers.push(key);
        fields.push(key);
      }
    });

    const body = data.map((task) => fields.map((f) => task[f] || ""));

    autoTable(docPDF, {
      startY: 20,
      head: [headers],
      body,
      styles: { fontSize: 7 },
      theme: "grid",
    });

    docPDF.save("reporte_tareas.pdf");
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <TaskFilters filters={filters} setFilters={setFilters} />
        <div className="export-buttons">
          <button onClick={() => exportToExcel(filteredTasks)}>📥 Excel</button>
          <button onClick={() => exportToPDF(filteredTasks)}>📄 PDF</button>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            {Object.entries(visibleCols)
              .filter(([_, v]) => v)
              .map(([col]) => (
                <th key={col}>{col}</th>
              ))}
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {filteredTasks.length ? (
            filteredTasks.map((task) => (
              <tr key={task.id}>
                {Object.entries(visibleCols)
                  .filter(([_, v]) => v)
                  .map(([col]) => (
                    <td key={col}>{task[col] || ""}</td>
                  ))}
                <td>
                  <button onClick={() => handleEditClick(task)}>✏️</button>
                  <button onClick={() => handleDeleteClick(task.id)}>🗑️</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={Object.keys(visibleCols).length + 1}>
                No hay tareas registradas
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {taskToEdit && (
        <EditTaskModal
          task={taskToEdit}
          onClose={() => setTaskToEdit(null)}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};

export default TaskTable;











