import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/form.css";

const Register = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signup({
        nombre,
        empresa,
        email,
        password,
      });

      navigate("/bienvenida");
    } catch (err) {
      console.error(err);
      setError("❌ Error al crear la cuenta. Verificá los datos.");
    }
  };

  return (
    <div className="task-form">
      <h2>Crear cuenta</h2>

      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Nombre y apellido</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Empresa</label>
          <input
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
            placeholder="Nombre de tu empresa o emprendimiento"
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Registrarme</button>

        <p>
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;

