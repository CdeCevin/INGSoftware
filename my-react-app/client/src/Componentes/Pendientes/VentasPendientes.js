// my-react-app/client/src/Componentes/Pendientes/ListadoPendientes.js
import React, { useEffect, useState } from 'react';

const ListadoPendientes = () => {
    const [pendientes, setPendientes] = useState([]);

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
            <br></br>
            <h1>Ventas Pendientes</h1><br></br>
            <table className="venta-table">
                <thead>
                    <tr>
                        <th>ID VENTA</th>
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
                    {pendientes.length > 0 ? (
                        pendientes.map(venta => (
                            <tr key={venta.idVenta}>
                                <td className="venta-cell">{venta.idVenta}</td>
                                <td className="venta-cell">{new Date(venta.fecha).toLocaleDateString()}</td>
                                <td className="venta-cell">{venta.cliente}</td>
                                <td className="venta-cell">{venta.direccion}</td>
                                <td className="venta-cell">
                                    <div className="acordeon">
                                        <ul>
                                            {venta.productos && venta.productos.length > 0 ? (
                                                venta.productos.map((producto, index) => (
                                                    <li key={index}>
                                                        {producto.nombre} ({producto.cantidad} {producto.color})
                                                    </li>
                                                ))
                                            ) : (
                                                <li>No hay productos disponibles</li>
                                            )}
                                        </ul>
                                    </div>
                                </td>
                                <td className="venta-cell">{venta.precioTotal}</td>
                                <td className="venta-cell">
                                    <a href={`Realizado.php?id=${venta.idVenta}`} className="btn">
                                        <i className="fa fa-check" aria-hidden="true"></i>
                                    </a>
                                </td>
                                <td className="venta-cell">
                                    <a href={`Cancelar.php?id=${venta.idVenta}`} className="btn">
                                        <i className="fa fa-times" aria-hidden="true"></i>
                                    </a>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" style={{ textAlign: 'center' }}>No hay ventas pendientes.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default ListadoPendientes;
