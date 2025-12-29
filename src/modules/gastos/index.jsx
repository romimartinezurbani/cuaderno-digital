import React from "react";
import GastosForm from "./GastosForm";
import GastosTable from "./GastosTable";
import "../../styles/table.css";
import "../../styles/form.css";

const Gastos = () => {
  return (
    <div className="tareas-container">
      <h2 className="section-title">Gestión de Gastos</h2>

      <GastosForm />
      <GastosTable />
    </div>
  );
};

export default Gastos;
