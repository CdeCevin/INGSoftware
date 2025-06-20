// CdeCevin/INGSoftware/my-react-app/client/src/Componentes/login/login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import './estiloide.css';

const LoginForm = () => {
    const navigate = useNavigate();

    const [rut, setRut] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        document.title = 'Iniciar Sesión'; // O 'Login', o 'Ingresar'
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rut, password }) //aqui si tiene q estar xd
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Rut o contraseña inválidos');
                return;
            }

            // --- ¡MODIFICACIÓN CLAVE AQUÍ! ---
            // Desestructuramos el 'token', 'role' y 'rut' de la respuesta del backend
            const { token, role, rut: loggedInRut } = data; 

            // Guardar el token, el rol y el RUT en localStorage
            localStorage.setItem('token', token); // <-- NUEVA LÍNEA para guardar el token
            localStorage.setItem('userRole', role);
            localStorage.setItem('userRut', loggedInRut);
            // ---------------------------------

            console.log('Login exitoso! Token y rol guardados.');
            navigate('/Bienvenido/inicio', { replace: true });

        } catch (err) {
            console.error('Error en login:', err);
            setError('No se pudo conectar al servidor');
        }
    };

    return (
        <div className="main-block2">
            <form onSubmit={handleSubmit}>
                <h1>Ingresar</h1>
                <fieldset>
                    <h3>
                        Ingrese sus datos a continuación
                    </h3>
                    <div className="account-details2">
                        <div>
                            <label>RUT*</label>
                            <input
                                type="text"
                                id="rut"
                                name="input-rut"
                                pattern="[0-9]+"
                                minLength="8"
                                maxLength="9"
                                placeholder='No considere puntos ni guión'
                                required
                                value={rut}
                                onChange={(e) => setRut(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Contraseña*</label>
                            <input
                                type="password"
                                id="password"
                                name="input-cont"
                                minLength="8"
                                maxLength="16"
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