// src/components/LoginForm.js
import React from 'react';
import { Link } from 'react-router-dom';
import './estiloide.css';

const LoginForm = () => {
  return (
    <div className="main-block2" style={{ backgroundColor: '#eaeeea' }}>
      <form>
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
              />
            </div>
          </div>
        </fieldset>
        <Link to="/Bienvenido/inicio">
          <button type="button">Entrar</button>
        </Link>
      </form>
    </div>
  );
};

export default LoginForm;
