// my-react-app/client/src/Componentes/Pendientes/ListadoPendientes.js
import React, { useEffect, useState } from 'react';

const ListadoPendientes = () => {
    const [pendientes, setPendientes] = useState([]);
    const [visibleTables, setVisibleTables] = useState({});

    const handleButtonClick = (idVenta) => {
        setVisibleTables((prevState) => ({
          ...prevState,
          [idVenta]: !prevState[idVenta],
        }));
    };

    const marcarRealizado = async (idVenta) => {
        try {
            const response = await fetch(`http://localhost:3001/api/pendientes/realizado?idVenta=${idVenta}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                // Remover la venta realizada de la lista de pendientes
                setPendientes((prevPendientes) => prevPendientes.filter((venta) => venta.idVenta !== idVenta));
            } else {
                console.error('Error al marcar como realizado:', response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    };

    const cancelarVenta = async (idVenta) => {
        try {
            const response = await fetch(`http://localhost:3001/api/pendientes/cancelar/${idVenta}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                // Remover la venta cancelada de la lista de pendientes
                setPendientes((prevPendientes) => prevPendientes.filter((venta) => venta.idVenta !== idVenta));
            } else {
                console.error('Error al cancelar la venta:', response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    };

    useEffect(() => {
        const fetchPendientes = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/pendientes');
                if (!response.ok) {
                    throw new Error('Error en la respuesta de la API');
                }
                const data = await response.json();
                console.log('Datos obtenidos de la API:', data); // Verifica los datos
                setPendientes(data);
            } catch (error) {
                console.error('Error al obtener la lista de pendientes:', error);
            }
        };

        fetchPendientes();
    }, []);

    useEffect(() => {
        document.title = 'Pendientes';
    }, []);

    return (
        <div style={{ marginLeft: '13%' }}>
            <div className="main-block">
                <br />
                <h1>Ventas Pendientes</h1>
                <br />
                {pendientes.length > 0 ? (
                pendientes.map((venta) => (
                    <div key={venta.idVenta} className="venta-block">
                    <table className="venta-table">
                        <thead>
                        <tr>
                            <th>Código Venta</th>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Dirección</th>
                            <th>Productos</th>
                            <th>Total</th>
                            <th>Realizado</th>
                            <th>Cancelar</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="venta-cell">{venta.idVenta}</td>
                            <td className="venta-cell">{new Date(venta.fecha).toLocaleDateString()}</td>
                            <td className="venta-cell">{venta.cliente}</td>
                            <td className="venta-cell">{venta.direccion}</td>
                            <td className="venta-cell">
                            <button className='btn_Pendientes' onClick={() => handleButtonClick(venta.idVenta)}>Ver Productos</button>
                            {visibleTables[venta.idVenta] && (
                            <table style={{borderCollapse: 'collapse'}}>
                                <tbody>
                                {venta.productos && venta.productos.length > 0 ? (
                                    venta.productos.map((producto, index) => (
                                    <tr key={index}>
                                        <td style={{border: 'none'}}> - {producto.nombre},{producto.cantidad},{producto.color}</td>
                                    </tr>
                                    ))
                                ) : (
                                    <tr>
                                    <td colSpan="3" style={{border: 'none'}}>No hay productos disponibles</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>)}
                            </td>
                            <td className="venta-cell">${venta.precioTotal}</td>
                            <td className="venta-cell">
                            {/* Llamada a la función de marcar como realizado */}
                            <button className="btn" onClick={() => marcarRealizado(venta.idVenta)}>
                                <i className="fa fa-check" aria-hidden="true"></i>
                            </button>
                            </td>
                            <td className="venta-cell">
                            {/* Llamada a la función de cancelar venta */}
                            <button className="btn" onClick={() => cancelarVenta(venta.idVenta)}>
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
            </div>
        </div>
    );
};

export default ListadoPendientes;









/* 

const ListadoPendientes = () => {
    const [pendientes, setPendientes] = useState([]);
    const [visibleTables, setVisibleTables] = useState({});

    const handleButtonClick = (idVenta) => {
        setVisibleTables((prevState) => ({
            ...prevState,
            [idVenta]: !prevState[idVenta],
        }));
    };

    const cancelarVenta = async (idVenta) => {
        try {
            const response = await fetch(`http://localhost:3001/api/pendientes/cancelar/${idVenta}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                // Actualizar el estado de las ventas pendientes
                setPendientes(prev => prev.filter(venta => venta.idVenta !== idVenta));
            } else {
                throw new Error('Error al cancelar la venta');
            }
        } catch (error) {
            console.error('Error al cancelar la venta pendiente:', error);
        }
    };

    const realizarVenta = async (idVenta) => {
        try {
            const response = await fetch(`http://localhost:3001/api/pendientes/realizar/${idVenta}`, {
                method: 'PUT',
            });
            if (response.ok) {
                // Actualizar el estado de las ventas pendientes
                setPendientes(prev => prev.filter(venta => venta.idVenta !== idVenta));
            } else {
                throw new Error('Error al realizar la venta');
            }
        } catch (error) {
            console.error('Error al realizar la venta pendiente:', error);
        }
    };

    useEffect(() => {
        const fetchPendientes = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/pendientes');
                if (!response.ok) {
                    throw new Error('Error en la respuesta de la API');
                }
                const data = await response.json();
                setPendientes(data);
            } catch (error) {
                console.error('Error al obtener la lista de pendientes:', error);
            }
        };

        fetchPendientes();
    }, []);

    return (
        <div style={{ marginLeft: '13%' }}>
            <div className="main-block">
                <br />
                <h1>Ventas Pendientes</h1>
                <br />
                {pendientes.length > 0 ? (
                    pendientes.map((venta) => (
                        <div key={venta.idVenta} className="venta-block">
                            <table className="venta-table">
                                <thead>
                                    <tr>
                                        <th>Código Venta</th>
                                        <th>Fecha</th>
                                        <th>Cliente</th>
                                        <th>Dirección</th>
                                        <th>Productos</th>
                                        <th>Total</th>
                                        <th>Realizado</th>
                                        <th>Cancelar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="venta-cell">{venta.idVenta}</td>
                                        <td className="venta-cell">{new Date(venta.fecha).toLocaleDateString()}</td>
                                        <td className="venta-cell">{venta.cliente}</td>
                                        <td className="venta-cell">{venta.direccion}</td>
                                        <td className="venta-cell">
                                            <button className='btn_Pendientes' onClick={() => handleButtonClick(venta.idVenta)}>Ver Productos</button>
                                            {visibleTables[venta.idVenta] && (
                                                <table style={{ borderCollapse: 'collapse' }}>
                                                    <tbody>
                                                        {venta.productos && venta.productos.length > 0 ? (
                                                            venta.productos.map((producto, index) => (
                                                                <tr key={index}>
                                                                    <td style={{ border: 'none' }}> - {producto.nombre},{producto.cantidad},{producto.color}</td>
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
                                            <button onClick={() => realizarVenta(venta.idVenta)} className="btn">
                                                <i className="fa fa-check" aria-hidden="true"></i>
                                            </button>
                                        </td>
                                        <td className="venta-cell">
                                            <button onClick={() => cancelarVenta(venta.idVenta)} className="btn">
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
            </div>
        </div>
    );
};

export default ListadoPendientes;


*/