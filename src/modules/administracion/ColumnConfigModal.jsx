import React from "react";
import { COLUMNAS_POR_DEFECTO } from "./constants";
import "../../styles/admin.css";

const ColumnConfigModal = ({
  modulo,
  columnasSeleccionadas,
  onToggleColumna,
  onGuardar,
  onCerrar,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Columnas visibles para {modulo}</h3>

        <div className="columnas-lista scrollable">
          {COLUMNAS_POR_DEFECTO[modulo].map((col) => (
            <label key={col} className="checkbox-item">
              <input
                type="checkbox"
                checked={columnasSeleccionadas.includes(col)}
                onChange={() => onToggleColumna(col)}
              />
              {col}
            </label>
          ))}
        </div>

        <div className="modal-actions">
          <button className="btn-approve" onClick={onGuardar}>
            Guardar
          </button>
          <button className="btn-cancel" onClick={onCerrar}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColumnConfigModal;
