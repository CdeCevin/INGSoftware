"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./estiloide.css"

const LoginForm = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate("/Bienvenido/inicio", { replace: true })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Bienvenido</h1>
          <p>Ingrese sus credenciales para continuar</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="rut">RUT</label>
            <div className="input-container">
              <input
                id="rut"
                type="text"
                name="input-rut"
                maxLength="9"
                pattern="[0-9]+"
                placeholder="Ingrese su RUT sin puntos ni guión"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-container password-container">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="input-cont"
                pattern="[0-9]+"
                maxLength="20"
                placeholder="Ingrese su contraseña"
                required
              />
              <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <div className="forgot-password">
            <a href="#">¿Olvidó su contraseña?</a>
          </div>

          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
