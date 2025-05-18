// src/components/LoginForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './estiloide.css';

const LoginForm = () => {
  const navigate = useNavigate();

  // 1) Estados para los campos y error
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 2) Llamada al backend
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rut, password })
      });

      const data = await response.json();

      if (!response.ok) {
        // 3a) Error de autenticación
        setError(data.message || 'Rut o contraseña inválidos');
        return;
      }

      const { role } = data;
      // 3b) Guardas el rol (puede ser en Context en lugar de localStorage)
      localStorage.setItem('userRole', role);

      // 4) Redireccionas
      navigate('/Bienvenido/inicio', { replace: true });

    } catch (err) {
      console.error('Error en login:', err);
      setError('No se pudo conectar al servidor');
    }
  };

  return (
    <div className="main-block2" style={{ backgroundColor: '#eaeeea' }}>
      <form onSubmit={handleSubmit}>
        <h1 style={{ textAlign: 'center' }}>Ingresar</h1>
        <fieldset>
          <legend>
            <h3 style={{ textAlign: 'center' }}>
              Ingrese sus datos a continuación
            </h3>
          </legend>
          <div className="account-details2">
            <div>
              <label>RUT*</label>
              <input
                type="text"
                name="input-rut"
                maxLength="10"
                pattern="[0-9]+"
                required
                value={rut}
                onChange={(e) => setRut(e.target.value)}
              />
            </div>
            <div>
              <label>Contraseña*</label>
              <input
                type="password"
                name="input-cont"
                maxLength="20"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </fieldset>

        {error && (
          <p style={{ color: 'red', textAlign: 'center', marginTop: '0.5rem' }}>
            {error}
          </p>
        )}

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default LoginForm;
