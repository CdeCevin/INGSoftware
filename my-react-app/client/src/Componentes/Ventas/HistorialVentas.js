import React, { useState, useEffect } from 'react';

function HistorialVentas() {
    const [ventas, setVentas] = useState([]);

    // Hacer la solicitud al backend para obtener los datos de ventas
    useEffect(() => {
        fetch('http://localhost:3001/api/historialVentas/historialVentas') // Reemplaza con tu endpoint
            .then(response => response.json())
            .then(data => setVentas(data))
            .catch(error => console.error('Error al obtener ventas:', error));
    }, []);

    return (
        <div>
            <h1>Historial de Ventas</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Dirección</th>
                        <th>Productos</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {ventas.map((venta, index) => (
                    <tr key={index}>
                        <td>{venta.codigoComprobante}</td>
                        <td>{new Date(venta.fecha).toLocaleDateString()}</td> {/* Formatea la fecha */}
                        <td>{venta.nombreCliente}</td>
                        <td>{`${venta.direccionCalle} ${venta.numeroDireccion}, ${venta.ciudad}, ${venta.region}`}</td>
                        <td>
                        <ul>
                            {venta.productos.map((producto, prodIndex) => (
                            <li key={prodIndex}>{producto}</li>
                            ))}
                        </ul>
                        </td>
                        <td>{venta.precioTotal}</td>
                    </tr>
                    ))}
</tbody>

            </table>
        </div>
    );
}

export default HistorialVentas;
