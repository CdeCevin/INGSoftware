// CdeCevin/INGSoftware/my-react-app/client/src/Componentes/Usuarios/ListadoUsuarios.js

import React, { useEffect, useState } from 'react';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import authenticatedFetch from '../../utils/api'; // --- MODIFICACIONES AQUÍ: Importar authenticatedFetch
import { useNavigate } from 'react-router-dom'; // --- MODIFICACIONES AQUÍ: Importar useNavigate para redirección

const ListadoUsuarios = () => {
    console.log("HOLAA");
    const navigate = useNavigate(); // --- MODIFICACIONES AQUÍ: Inicializar useNavigate

    const [Usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        document.title = 'Listado Usuarios';
    }, []);

    useEffect(() => {
        async function obtenerUsuarios() {
            setCargando(true);
            try {
                // --- MODIFICACIONES AQUÍ: Usar authenticatedFetch en lugar de fetch
                const res = await authenticatedFetch('/userList'); 

                // --- MODIFICACIONES AQUÍ: Manejar estados de error de autenticación/autorización
                if (res.status === 401 || res.status === 403) {
                    const errorData = await res.json();
                    setError(errorData.message || 'No autorizado o sesión expirada.');
                    // Redirigir al login si el token es inválido o expirado
                    // O si no tiene permiso (en este caso, 'No autorizado' es más general)
                    navigate('/login'); // Asegúrate de que esta sea la ruta a tu componente de Login
                    return; // Detener la ejecución
                }
                // --------------------------------------------------------------------------

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'Error en la red al obtener usuarios');
                }
                
                const data = await res.json();
                setUsuarios(data);
            } catch (e) {
                console.error("Error al obtener usuarios:", e); // --- MODIFICACIONES AQUÍ: Loguear el error completo
                setError(e.message);
            } finally {
                setCargando(false);
            }
        }
        obtenerUsuarios();
    }, [navigate]); // --- MODIFICACIONES AQUÍ: Añadir navigate como dependencia si se usa en useEffect

    if (cargando) {
        return <div>Cargando Usuarios...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center' }}>Error: {error}</div>;
    }

    return (
        <div className="main-block">
            <h1>Listado de Usuarios</h1>
            <fieldset>
                <h3>Usuarios añadidos</h3>
                <table className="venta-table">
                    <thead>
                        <tr>
                            <th>RUT</th>
                            <th>TELÉFONO</th>
                            <th>NOMBRE</th>
                            <th>TIPO DE USUARIO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Usuarios.map(u => (
                            <tr key={u.RUT}>
                                <td>{u.RUT}</td>
                                <td>{u.Telefono}</td>
                                <td>{u.Nombre}</td>
                                <td>{u.Tipo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </fieldset>
        </div>
    );
};

export default ListadoUsuarios;