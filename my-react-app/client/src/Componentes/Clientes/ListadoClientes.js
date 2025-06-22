import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authenticatedFetch from '../../utils/api';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';

const ListadoClientes = () => {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');
    
    useEffect(() => {
        document.title = 'Listado Clientes';
        const allowedRoles = ['Administrador', 'Vendedor'];

        if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
            navigate('/login');
            return;
        }

        const fetchClientes = async () => {
            try {
                const response = await authenticatedFetch('/clientes');

                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userRole');
                    localStorage.removeItem('userRut');
                    navigate('/login');
                    return;
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al obtener la lista de clientes.');
                }
                const data = await response.json();
                setClientes(data);
            } catch (err) {
                setError(err.message || 'No se pudo cargar la lista de clientes.');
            } finally {
                setLoading(false);
            }
        };

        fetchClientes();
    }, [userRole, navigate]);

    if (loading) {
        return (
            <div className="main-block">
                <h1>Cargando Clientes...</h1>
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

    const allowedRoles = ['Administrador', 'Vendedor'];
    if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
        return (
            <div className="main-block">
                <h1>Redirigiendo...</h1>
            </div>
        );
    }

    return (
        <div className="main-block">
            <h1>Registro Clientes</h1>

            <table className="venta-table">
                <thead>
                    <tr>
                        <th>CÓDIGO</th>
                        <th>TELÉFONO</th>
                        <th>NOMBRE</th>
                        <th>DIRECCIÓN</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.length > 0 ? (
                        clientes.map(cliente => (
                            <tr key={cliente.codigo}>
                                <td className="venta-cell">{cliente.codigo}</td>
                                <td className="venta-cell">{cliente.telefono}</td>
                                <td className="venta-cell">{cliente.nombre}</td>
                                <td className="venta-cell">{cliente.direccion}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>No hay clientes registrados.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ListadoClientes;