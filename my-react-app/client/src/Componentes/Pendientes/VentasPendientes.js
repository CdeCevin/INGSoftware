import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Estilos/estilo.css';
import Modal from 'react-modal';
import authenticatedFetch from '../../utils/api';

Modal.setAppElement('#root');

const ListadoPendientes = () => {
    const [pendientes, setPendientes] = useState([]);
    const [visibleTables, setVisibleTables] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        document.title = 'Pendientes';
        const allowedRoles = ['Administrador', 'Vendedor'];

        if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
            navigate('/login');
        }
    }, [userRole, navigate]);

    const fetchPendientes = async () => {
        try {
            const response = await authenticatedFetch('/ventasPendientes');

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userRut');
                navigate('/login');
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al obtener la lista de ventas pendientes.');
            }
            const data = await response.json();
            setPendientes(data);
        } catch (err) {
            setError(err.message || 'No se pudo cargar la lista de ventas pendientes.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendientes();
    }, []);

    useEffect(() => {
        const storedVisibleTables = localStorage.getItem('visibleTables');
        if (storedVisibleTables) {
            setVisibleTables(JSON.parse(storedVisibleTables));
        }
    }, []);

    const handleButtonClick = (idVenta) => {
        setVisibleTables((prevState) => ({
            ...prevState,
            [idVenta]: !prevState[idVenta],
        }));
    };

    const realizarVenta = async (idVenta) => {
        try {
            const response = await authenticatedFetch('/ventasPendientes/realizar', {
                method: 'POST',
                body: ({ idVenta }),
            });

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userRut');
                navigate('/login');
                return;
            }

            if (response.ok) {
                const data = await response.json();
                setModalMessage(data.message);
                setPendientes((prevPendientes) => prevPendientes.filter(venta => venta.idVenta !== idVenta));
            } else {
                const errorData = await response.json();
                setModalMessage(errorData.message);
            }
        } catch (err) {
            setModalMessage('Error al realizar la venta.');
        } finally {
            setModalIsOpen(true);
        }
    };

    const cancelarVenta = async (idVenta) => {
        try {
            const response = await authenticatedFetch('/ventasPendientes/cancelar', {
                method: 'POST',
                body: JSON.stringify({ idVenta }),
            });

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userRut');
                navigate('/login');
                return;
            }

            if (response.ok) {
                const data = await response.json();
                setModalMessage(data.message);
                setPendientes((prevPendientes) => prevPendientes.filter(venta => venta.idVenta !== idVenta));
            } else {
                const errorData = await response.json();
                setModalMessage(errorData.message);
            }
        } catch (err) {
            setModalMessage('Error al cancelar la venta.');
        } finally {
            setModalIsOpen(true);
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const allowedRoles = ['Administrador', 'Vendedor'];
    if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
        return (
            <div className="main-block">
                <h1>Redirigiendo...</h1>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="main-block">
                <h1>Cargando Ventas Pendientes...</h1>
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

    return (
        <div className="main-block">
            <h1>Ventas Pendientes</h1>
            {pendientes.length > 0 ? (
                pendientes.map((venta) => (
                    <div key={venta.idVenta} className="venta-block">
                        <table className="venta-table">
                            <thead>
                                <tr>
                                    <th>CÓDIGO DE VENTA</th>
                                    <th>FECHA</th>
                                    <th>CLIENTE</th>
                                    <th>DIRECCIÓN</th>
                                    <th>PRODUCTOS</th>
                                    <th>TOTAL</th>
                                    <th>COMPLETAR</th>
                                    <th>ANULAR</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="venta-cell">{venta.idVenta}</td>
                                    <td className="venta-cell">{new Date(venta.fecha).toLocaleDateString()}</td>
                                    <td className="venta-cell">{venta.cliente}</td>
                                    <td className="venta-cell">{venta.direccion}</td>
                                    <td className="venta-cell">
                                        <button className='btn_Pendientes' onClick={() => handleButtonClick(venta.idVenta)}>
                                            {visibleTables[venta.idVenta] ? "Cerrar Productos" : "Ver Productos"}
                                        </button>
                                        {visibleTables[venta.idVenta] && (
                                            <table style={{ borderCollapse: 'collapse' }}>
                                                <tbody>
                                                    {venta.productos && venta.productos.length > 0 ? (
                                                        venta.productos.map((producto, index) => (
                                                            <tr key={index}>
                                                                <td style={{ border: 'none' }}> - {producto.nombre}, {producto.cantidad}, {producto.color}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="3" style={{ border: 'none' }}>No hay productos disponibles</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        )}
                                    </td>
                                    <td className="venta-cell">${venta.precioTotal}</td>
                                    <td className="venta-cell">
                                        <button className="btn complete-btn" onClick={() => realizarVenta(venta.idVenta)}>
                                            <i className="fa fa-check" aria-hidden="true"></i>
                                        </button>
                                    </td>
                                    <td className="venta-cell">
                                        <button className="btn cancel-btn" onClick={() => cancelarVenta(venta.idVenta)}>
                                            <i className="fa fa-times" aria-hidden="true"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))
            ) : (
                <p>No hay ventas pendientes.</p>
            )}

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className={"custom-modal"}>
                <h2>Mensaje</h2>
                <p>{modalMessage}</p>
                <button onClick={closeModal}>Cerrar</button>
            </Modal>
        </div>
    );
};

export default ListadoPendientes;