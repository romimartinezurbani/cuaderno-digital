import React from 'react';
import TaskForm from '../../components/TaskForm';
import TaskTable from '../../components/TaskTable';
import '../../styles/table.css';
import '../../styles/form.css';

const Tareas = () => {
  return (
    <div className="tareas-container">
      <h2 className="section-title">Gestión de Tareas</h2>
      <TaskForm />
      <TaskTable />
    </div>
  );
};

export default Tareas;
