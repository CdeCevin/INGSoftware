import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authenticatedFetch from '../../utils/api';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';

const VisualizarDatos = () => {
    const [datos, setDatos] = useState({
        telefono: '',
        nombre: '',
        nombreCalle: '',
        numeroDireccion: '',
        nombreCiudad: '',
        nombreRegion: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        document.title = 'Datos Empresa';
        const allowedRoles = ['Administrador'];

        if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
            navigate('/login');
            return;
        }

        const obtenerDatosCliente = async () => {
            try {
                const response = await authenticatedFetch('/datosEmpresa');

                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userRole');
                    localStorage.removeItem('userRut');
                    navigate('/login');
                    return;
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al obtener los datos de la empresa.');
                }
                const data = await response.json();
                setDatos({
                    telefono: data.telefono,
                    nombre: data.nombre,
                    nombreCalle: data.nombreCalle,
                    numeroDireccion: data.numeroDireccion,
                    nombreCiudad: data.nombreCiudad,
                    nombreRegion: data.nombreRegion,
                });
            } catch (err) {
                setError(err.message || 'No se pudieron cargar los datos de la empresa.');
            } finally {
                setLoading(false);
            }
        };

        obtenerDatosCliente();
    }, [userRole, navigate]);

    if (loading) {
        return (
            <div className="main-block">
                <h1>Cargando Datos de la Empresa...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div className="main-block">
                <h1>Error</h1>
                <p>{error}</p>
            </div>
        );
    }

    const allowedRoles = ['Administrador'];
    if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
        return (
            <div className="main-block">
                <h1>Redirigiendo...</h1>
            </div>
        );
    }

    return (
        <div className="main-block">
            <h1>Datos Empresa</h1>

            <fieldset>
                <div className="w3-container2">
                    <p style={{ color: '#637e74', fontSize: '18px', paddingLeft: '10px', paddingTop: '10px' }}><strong>Nombre:</strong> <span style={{ color: '#666' }}>{datos.nombre}</span></p>
                    <p style={{ color: '#637e74', fontSize: '18px', paddingLeft: '10px', paddingTop: '10px' }}><strong>Dirección:</strong> <span style={{ color: '#666' }}> {datos.nombreCalle} {datos.numeroDireccion}, {datos.nombreCiudad}, {datos.nombreRegion}</span></p>
                    <p style={{ color: '#637e74', fontSize: '18px', paddingLeft: '10px', paddingTop: '10px' }}><strong>Teléfono:</strong> <span style={{ color: '#666' }}>{datos.telefono}</span></p>
                </div>
            </fieldset>
        </div>
    );
};

export default VisualizarDatos;