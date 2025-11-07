import React, { useState } from 'react';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/form.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 🔍 Verificar si el email ya está registrado antes de crear el usuario
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        setError('⚠️ Este correo ya está registrado. Iniciá sesión en lugar de crear una cuenta.');
        return;
      }

      // 🧾 Crear el nuevo usuario
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // 🗂️ Guardar información del usuario en Firestore
      await setDoc(doc(db, 'usuarios', userCredential.user.uid), {
        nombre,
        email,
        modulos: { tareas: true, facturacion: true , clientes: true, administracion: false },
      });

      navigate('/tareas');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/invalid-email') {
        setError('❌ El correo ingresado no es válido.');
      } else if (err.code === 'auth/weak-password') {
        setError('🔒 La contraseña es demasiado débil. Debe tener al menos 6 caracteres.');
      } else {
        setError('❌ Ocurrió un error al registrar el usuario.');
      }
    }
  };

  return (
    <div className="task-form">
      <h2>Crear cuenta</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Nombre</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </div>

        {error && <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>}

        <button type="submit">Registrarme</button>
        <p>¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link></p>
      </form>
    </div>
  );
};

export default Register;
