import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import TaskFilters from './TaskFilters';
import EditTaskModal from './EditTaskModal';
import '../styles/table.css';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const TaskTable = () => {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ cliente: '', tarea: '' });
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, 'tareas'));
      const fetchedTasks = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(task => !task.eliminado);
      setTasks(fetchedTasks);
    };

    fetchTasks();
  }, []);

  const handleEditClick = (task) => {
    setTaskToEdit(task);
  };

  const handleSaveTask = async (updatedTask) => {
    await updateDoc(doc(db, 'tareas', updatedTask.id), updatedTask);
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setTaskToEdit(null);
  };

  const handleDeleteClick = async (taskId) => {
    const confirm = window.confirm('¿Estás seguro que querés eliminar esta tarea?');
    if (!confirm) return;

    await updateDoc(doc(db, 'tareas', taskId), { eliminado: true });
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const filteredTasks = tasks.filter((task) => {
    const clienteMatch = filters.cliente === '' || task.cliente === filters.cliente;
    const tareaMatch = filters.tarea === '' || task.tarea === filters.tarea;
    return clienteMatch && tareaMatch;
  });

  const exportToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data.map(task => ({
      Fecha: task.fecha,
      Cliente: task.cliente,
      Campo: task.campo,
      Lote: task.lote,
      Tarea: task.tarea,
      Hectáreas: task.hectareas,
      'USD/ha': task.usdPorHa,
      'Total USD': (task.hectareas * task.usdPorHa).toFixed(2),
      nroOrden: task.nroorden,
      Observaciones: task.observaciones,
      Facturado: task.facturado ? '✔' : '✘',
      Cobrado: task.cobrado ? '✔' : '✘',
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tareas');
    XLSX.writeFile(workbook, 'reporte_tareas.xlsx');
  };

  const exportToPDF = (data) => {
    const doc = new jsPDF();
    doc.text('Reporte de Tareas', 14, 16);

    const tableData = data.map(task => [
      task.fecha,
      task.cliente,
      task.campo,
      task.lote,
      task.tarea,
      task.hectareas,
      task.usdPorHa,
      (task.hectareas * task.usdPorHa).toFixed(2),
      task.nroorden,
      task.observaciones,
      task.facturado ? '✔' : '✘',
      task.cobrado ? '✔' : '✘',
    ]);

    autoTable(doc, {
      startY: 20,
      head: [['Fecha', 'Cliente', 'Campo', 'Lote', 'Tarea', 'Ha', 'USD/ha', 'Total USD', 'Nro Orden', 'Observaciones', 'Facturado', 'Cobrado']],
      body: tableData,
      styles: { fontSize: 7 },
      theme: 'grid',
    });

    doc.save('reporte_tareas.pdf');
  };

  return (
    <div>
      <div className="table-controls">
        <TaskFilters filters={filters} setFilters={setFilters} />
        <div style={{ display: 'flex', gap: '12px', margin: '15px 0' }}>
        <button className="btn" onClick={() => exportToExcel(filteredTasks)}>📥 Exportar a Excel</button>
        <button className="btn" onClick={() => exportToPDF(filteredTasks)}>📄 Exportar a PDF</button>
      </div>
      </div>

      <table className="task-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Campo</th>
            <th>Lote</th>
            <th>Tarea</th>
            <th>Ha</th>
            <th>USD/ha</th>
            <th>Total USD</th>
            <th>Nro Orden</th>
            <th>Observaciones</th>
            <th>Facturado</th>
            <th>Cobrado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => (
            <tr key={task.id}>
              <td>{task.fecha}</td>
              <td>{task.cliente}</td>
              <td>{task.campo}</td>
              <td>{task.lote}</td>
              <td>{task.tarea}</td>
              <td>{task.hectareas}</td>
              <td>{task.usdPorHa}</td>
              <td>{(task.hectareas * task.usdPorHa).toFixed(2)}</td>
              <td>{task.nroorden}</td>
              <td>{task.observaciones}</td>
              <td>{task.facturado ? '✔' : '✘'}</td>
              <td>{task.cobrado ? '✔' : '✘'}</td>
              <td>
                <button className="btn-action" onClick={() => handleEditClick(task)}>✏️</button>
                <button className="btn-action" onClick={() => handleDeleteClick(task.id)}>🗑️</button>
              </td>
            </tr>
          ))}
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


