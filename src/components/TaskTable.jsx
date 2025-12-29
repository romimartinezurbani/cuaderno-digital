import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import TaskFilters from "../components/TaskFilters";
import EditTaskModal from "./EditTaskModal";
import "../styles/table.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const TaskTable = ({ permisos }) => {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ cliente: "", tarea: "" });
  const [taskToEdit, setTaskToEdit] = useState(null);

  // ✅ columnas visibles según el panel de administración o por defecto
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

  // 🔄 Cargar tareas desde Firestore
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tareas"));
        const fetchedTasks = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((task) => !task.eliminado);
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error al obtener tareas:", error);
      }
    };
    fetchTasks();
  }, []);

  // 🔄 Actualizar columnas si cambian los permisos
  useEffect(() => {
    if (permisos?.tareas?.columnas) {
      setVisibleCols(permisos.tareas.columnas);
    }
  }, [permisos]);

  // 🔍 Filtrado básico
  const filteredTasks = tasks.filter((task) => {
    const clienteMatch =
      !filters.cliente ||
      (task.cliente && task.cliente.toLowerCase().includes(filters.cliente.toLowerCase()));
    const tareaMatch =
      !filters.tarea ||
      (task.tarea && task.tarea.toLowerCase().includes(filters.tarea.toLowerCase()));
    return clienteMatch && tareaMatch;
  });

  // ✏️ Editar tarea
  const handleEditClick = (task) => setTaskToEdit(task);

  const handleSaveTask = async (updatedTask) => {
    await updateDoc(doc(db, "tareas", updatedTask.id), updatedTask);
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setTaskToEdit(null);
  };

  // 🗑️ Eliminar (soft delete)
  const handleDeleteClick = async (taskId) => {
    if (!window.confirm("¿Estás seguro que querés eliminar esta tarea?")) return;
    await updateDoc(doc(db, "tareas", taskId), { eliminado: true });
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  // 📤 Exportar Excel
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
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tareas");
    XLSX.writeFile(workbook, "reporte_tareas.xlsx");
  };

  // 📄 Exportar PDF
  const exportToPDF = (data) => {
    const doc = new jsPDF();
    doc.text("Reporte de Tareas", 14, 16);

    const headers = [];
    const headerMap = [];

    Object.entries(visibleCols).forEach(([key, visible]) => {
      if (visible) {
        headers.push(key);
        headerMap.push(key);
      }
    });

    const tableData = data.map((task) => headerMap.map((field) => task[field] || ""));

    autoTable(doc, {
      startY: 20,
      head: [headers],
      body: tableData,
      styles: { fontSize: 7 },
      theme: "grid",
    });
    doc.save("reporte_tareas.pdf");
  };

  // 🧩 Render
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
              .filter(([_, visible]) => visible)
              .map(([col]) => (
                <th key={col}>{col}</th>
              ))}
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <tr key={task.id}>
                {Object.entries(visibleCols)
                  .filter(([_, visible]) => visible)
                  .map(([col]) => (
                    <td key={col}>{task[col] || ""}</td>
                  ))}
                <td>
                  <button className="btn-action" onClick={() => handleEditClick(task)}>✏️</button>
                  <button className="btn-action" onClick={() => handleDeleteClick(task.id)}>🗑️</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={Object.keys(visibleCols).length + 1} style={{ textAlign: "center" }}>
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










