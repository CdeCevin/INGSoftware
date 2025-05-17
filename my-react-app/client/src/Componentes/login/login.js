// src/components/LoginForm.js
import React, { useState } from 'react';
import './estiloide.css';

const LoginForm = () => {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3001/ingreso', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rut, password }),
    });

    const data = await response.json();
    alert(data.message);
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
                maxLength="9"
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
                pattern="[0-9]+"
                maxLength="20"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </fieldset>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default LoginForm;
