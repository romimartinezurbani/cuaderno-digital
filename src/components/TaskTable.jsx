import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import TaskFilters from '../components/TaskFilters';
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

  const handleEditClick = (task) => setTaskToEdit(task);

  const handleSaveTask = async (updatedTask) => {
    await updateDoc(doc(db, 'tareas', updatedTask.id), updatedTask);
    setTasks(prev =>
      prev.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );
    setTaskToEdit(null);
  };

  const handleDeleteClick = async (taskId) => {
    const confirm = window.confirm('¿Estás seguro que querés eliminar esta tarea?');
    if (!confirm) return;
    await updateDoc(doc(db, 'tareas', taskId), { eliminado: true });
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const filteredTasks = tasks.filter(task => {
    const clienteMatch = filters.cliente === '' || task.cliente === filters.cliente;
    const tareaMatch = filters.tarea === '' || task.tarea === filters.tarea;
    return clienteMatch && tareaMatch;
  });

  const exportToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map(task => ({
        Fecha: task.fecha,
        'Grupo Empresarial': task.grupoEmpresarial,
        Cliente: task.cliente,
        'N° Cliente': task.nroCliente,
        CUIT: task.cuit || '',
        'Razón Social': task.razonsocial,
        'Condición IVA': task.condicionIva,
        Domicilio: task.domicilio,
        Estancia: task.estancia,
        Provincia: task.provincia,
        Localidad: task.localidad,
        'Ingeniero Contacto': task.ingenieroContacto,
        Coadyudante: task.coadyudante,
        'Retención Habitual (%)': task.retencionHabitual,
        Tarea: task.tarea,
        Hectáreas: task.hectareas,
        'USD/ha': task.usdPorHa,
        'Total USD': task.totalCobrar || (task.hectareas * task.usdPorHa).toFixed(2),
        Observaciones: task.observaciones,
        Facturado: task.facturado ? '✔' : '✘',
        Cobrado: task.cobrado ? '✔' : '✘',
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tareas');
    XLSX.writeFile(workbook, 'reporte_tareas.xlsx');
  };

  const exportToPDF = (data) => {
    const doc = new jsPDF();
    doc.text('Reporte de Tareas', 14, 16);
    const tableData = data.map(task => [
      task.fecha,
      task.grupoEmpresarial,
      task.cliente,
      task.nroCliente,
      task.cuit || '',
      task.razonsocial,
      task.condicionIva,
      task.domicilio,
      task.estancia,
      task.provincia,
      task.localidad,
      task.ingenieroContacto,
      task.coadyudante,
      task.retencionHabitual,
      task.tarea,
      task.hectareas,
      task.usdPorHa,
      task.totalCobrar || (task.hectareas * task.usdPorHa).toFixed(2),
      task.observaciones,
      task.facturado ? '✔' : '✘',
      task.cobrado ? '✔' : '✘',
    ]);
    autoTable(doc, {
      startY: 20,
      head: [['Fecha', 'Grupo Empresarial', 'Cliente', 'N° Cliente', 'CUIT', 'Razón Social', 'Condición IVA', 'Domicilio', 'Estancia', 'Provincia', 'Localidad', 'Ing. Contacto', 'Coadyudante', 'Retención (%)', 'Tarea', 'Ha', 'USD/ha', 'Total USD', 'Obs', 'Facturado', 'Cobrado']],
      body: tableData,
      styles: { fontSize: 6 },
      theme: 'grid',
    });
    doc.save('reporte_tareas.pdf');
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
            <th>Fecha</th>
            <th>Grupo Empresarial</th>
            <th>Cliente</th>
            <th>N° Cliente</th>
            <th>CUIT</th>
            <th>Razón Social</th>
            <th>Condición IVA</th>
            <th>Domicilio</th>
            <th>Estancia</th>
            <th>Provincia</th>
            <th>Localidad</th>
            <th>Ing. Contacto</th>
            <th>Coadyudante</th>
            <th>Retención (%)</th>
            <th>Tarea</th>
            <th>Ha</th>
            <th>USD/ha</th>
            <th>Total USD</th>
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
              <td>{task.grupoEmpresarial}</td>
              <td>{task.cliente}</td>
              <td>{task.nroCliente}</td>
              <td>{task.cuit}</td>
              <td>{task.razonsocial}</td>
              <td>{task.condicionIva}</td>
              <td>{task.domicilio}</td>
              <td>{task.estancia}</td>
              <td>{task.provincia}</td>
              <td>{task.localidad}</td>
              <td>{task.ingenieroContacto}</td>
              <td>{task.coadyudante}</td>
              <td>{task.retencionHabitual}</td>
              <td>{task.tarea}</td>
              <td>{task.hectareas}</td>
              <td>{task.usdPorHa}</td>
              <td>{task.totalCobrar || (task.hectareas * task.usdPorHa).toFixed(2)}</td>
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






