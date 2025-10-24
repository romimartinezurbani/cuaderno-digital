import React from 'react';
import TaskForm from '../../components/TaskForm';
import TaskTable from '../../components/TaskTable';

export default function Tareas() {
  return (
    <div className="module-container">
      <h2 className="module-title">Gestión de Tareas</h2>
      <TaskForm />
      <TaskTable />
    </div>
  );
}

