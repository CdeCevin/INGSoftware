import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authenticatedFetch from '../../utils/api';

function Boleta() {
    const [boleta, setBoleta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { codigoComprobante } = useParams();
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        document.title = `Boleta N° ${codigoComprobante || ''}`;

        const allowedRoles = ['Administrador', 'Vendedor'];

        if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
            navigate('/login');
            return;
        }

        const fetchBoleta = async () => {
            try {
                setLoading(true);
                const response = await authenticatedFetch(`/boleta/${codigoComprobante}`);

                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userRole');
                    localStorage.removeItem('userRut');
                    navigate('/login');
                    return;
                }

                if (response.ok) {
                    const data = await response.json();
                    setBoleta(data);
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al obtener la boleta');
                }
            } catch (err) {
                console.error('Error al hacer la solicitud:', err);
                setError('No se pudo cargar la boleta. Verifique el código o su conexión.');
            } finally {
                setLoading(false);
            }
        };

        if (codigoComprobante && localStorage.getItem('token')) {
            fetchBoleta();
        } else if (!codigoComprobante) {
            setError('No se proporcionó un código de comprobante.');
            setLoading(false);
        }
    }, [codigoComprobante, userRole, navigate]);

    const allowedRoles = ['Administrador', 'Vendedor'];
    if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
        return (
            <div className="main-block">
                <h1>Redirigiendo...</h1>
            </div>
        );
    }

    if (loading) {
        return <div className="main-block">Cargando boleta...</div>;
    }

    if (error) {
        return <div className="main-block">Error: {error}</div>;
    }

    if (!boleta) {
        return <div className="main-block">No se encontraron datos para esta boleta.</div>;
    }

    return (
        <div className="main-block">
            <fieldset>
                <legend>
                    <h3>Boleta</h3>
                </legend>
                <div style={{ padding: '10px' }}>
                    <div style={{ fontSize: '18px', paddingLeft: '10px', paddingTop: '10px' }}><strong>Usuario:</strong> {boleta.cabecera.NOMBRE_USUARIO}</div>
                    <div style={{ fontSize: '18px', paddingLeft: '10px' }}><strong>Nombre Cliente:</strong> {boleta.cabecera.NOMBRE_CLIENTE}</div>
                    <div style={{ fontSize: '18px', paddingLeft: '10px' }}><strong>Teléfono:</strong> {boleta.cabecera.TELEFONO}</div>
                    <div style={{ fontSize: '18px', paddingLeft: '10px' }}><strong>Dirección:</strong> {`${boleta.direccion.nombreCalle} #${boleta.direccion.numeroDireccion}, ${boleta.direccion.nombreCiudad}, ${boleta.direccion.nombreRegion}`}</div>
                    <div style={{ fontSize: '18px', paddingLeft: '10px' }}><strong>Fecha:</strong> {new Date(boleta.cabecera.FECHA).toLocaleDateString()}</div>
                    <div style={{ fontSize: '18px', paddingLeft: '10px', paddingBottom: '10px' }}><strong>Número Boleta:</strong> {boleta.codigoCabecera}</div>
                </div>

                <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%', borderTop: '1px solid #ccc' }}>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Color</th>
                            <th>Código Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                        </tr>
                    </thead>
                    <tbody>
                        {boleta.productos.map((producto, index) => (
                            <tr style={{ textAlign: 'center' }} key={index}>
                                <td>{producto[0]}</td>
                                <td>{producto[1]}</td>
                                <td>{producto[4]}</td>
                                <td>{producto[2]}</td>
                                <td>${producto[3]}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total a pagar:</td>
                            <td>${boleta.productos.reduce((acc, producto) => acc + (producto[2] * producto[3]), 0)}</td>
                        </tr>
                    </tfoot>
                </table>
            </fieldset>
        </div>
    );
}

export default Boleta;