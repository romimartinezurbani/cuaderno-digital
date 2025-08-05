// src/pages/Home.jsx
import React from 'react';
import TaskForm from '../components/TaskForm';

const Home = () => {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Cuaderno Digital</h1>
      <TaskForm />
    </main>
  );
};

export default Home;
