import React, { useState, useEffect } from 'react';
import '../../Estilos/estilo.css';
import authenticatedFetch from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import ComprobanteModal from './ComprobanteModal'; // Adjust the path as needed

function HistorialVentas() {
    const [ventas, setVentas] = useState([]);
    const [visibleTables, setVisibleTables] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedComprobante, setSelectedComprobante] = useState(null);

    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        document.title = 'Historial de Ventas';
        const allowedRoles = ['Administrador', 'Vendedor'];

        if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
            navigate('/login');
            return;
        }

        async function fetchVentas() {
            try {
                const response = await authenticatedFetch('/historialVentas/historialVentas');

                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userRole');
                    localStorage.removeItem('userRut');
                    navigate('/login');
                    return;
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al obtener historial de ventas');
                }

                const data = await response.json();
                const sortedData = data.sort((a, b) => b.codigoComprobante - a.codigoComprobante);
                setVentas(sortedData);
            } catch (error) {
                console.error('Error al obtener ventas:', error);
            }
        }

        fetchVentas();
    }, [userRole, navigate]);

    const handleButtonClick = (idVenta) => {
        setVisibleTables((prevState) => ({
            ...prevState,
            [idVenta]: !prevState[idVenta],
        }));
    };

    const handleVerBoleta = (codigoComprobante) => {
        setSelectedComprobante(codigoComprobante);
        setModalOpen(true);
    };

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
            <h1>Historial de Ventas</h1>
            {ventas.length > 0 ? (
                ventas.map((venta) => (
                    <div key={venta.codigoComprobante} className="venta-block">
                        <table className="venta-table">
                            <thead>
                                <tr>
                                    <th>CÓDIGO DE <br /> VENTA</th>
                                    <th>FECHA</th>
                                    <th>CLIENTE</th>
                                    <th>DIRECCIÓN</th>
                                    <th>PRODUCTOS</th>
                                    <th>TOTAL</th>
                                    <th>COMPROBANTE</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='venta-cell'>{venta.codigoComprobante}</td>
                                    <td className='venta-cell'>{new Date(venta.fecha).toLocaleDateString()}</td>
                                    <td className='venta-cell'>{venta.nombreCliente}</td>
                                    <td className='venta-cell'>{`${venta.direccionCalle} ${venta.numeroDireccion}, ${venta.ciudad}, ${venta.region}`}</td>
                                    <td className='venta-cell'>
                                        <button
                                            className='btn_Pendientes'
                                            onClick={() => handleButtonClick(venta.codigoComprobante)}
                                        >
                                            {visibleTables[venta.codigoComprobante] ? "Cerrar Productos" : "Ver Productos"}
                                        </button>
                                        {visibleTables[venta.codigoComprobante] && (
                                            <ul style={{ marginTop: '0.5rem' }}>
                                                {venta.productos && venta.productos.length > 0 ? (
                                                    venta.productos.map((producto, idx) => (
                                                        <li key={idx}>{producto}</li>
                                                    ))
                                                ) : (
                                                    <li>No hay productos disponibles</li>
                                                )}
                                            </ul>
                                        )}
                                    </td>
                                    <td className='venta-cell'>${venta.precioTotal}</td>
                                    <td>
                                        <button
                                            type="button"
                                            onClick={() => handleVerBoleta(venta.codigoComprobante)}
                                            className="btn btn-primary"
                                        >
                                            <i className="fa fa-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))
            ) : (
                <p>No hay ventas disponibles</p>
            )}

            {/* Comprobante Modal */}
            <ComprobanteModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                codigoComprobante={selectedComprobante}
            />
        </div>
    );
}

export default HistorialVentas;
