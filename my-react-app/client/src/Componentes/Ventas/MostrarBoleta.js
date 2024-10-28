import React, { useState, useEffect } from 'react';

function MostrarBoleta() {
    const [boleta, setBoleta] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3000/api/boleta')
            .then(response => response.json())
            .then(data => setBoleta(data))
            .catch(error => console.error('Error al obtener la boleta:', error));
    }, []);

    if (!boleta) return <div>Cargando boleta...</div>;

    return (
        <div>
            <h3>Boleta</h3>
            <div><strong>Nombre:</strong> {boleta.cabecera.NOMBRE_CLIENTE}</div>
            <div><strong>Teléfono:</strong> {boleta.cabecera.TELEFONO}</div>
            <div><strong>Dirección:</strong> {`${boleta.direccion.nombreRegion}, ${boleta.direccion.nombreCiudad}, ${boleta.direccion.nombreCalle} #${boleta.direccion.numeroDireccion}`}</div>
            <div><strong>Fecha:</strong> {boleta.cabecera.FECHA}</div>
            <div><strong>Número Boleta:</strong> {boleta.codigoCabecera}</div>

            <table>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Color</th>
                        <th>Código Producto</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                    </tr>
                </thead>
                <tbody>
                    {boleta.productos.map((producto, index) => (
                        <tr key={index}>
                            <td>{producto.NOMBRE_PRODUCTO}</td>
                            <td>{producto.COLOR_PRODUCTO}</td>
                            <td>{producto.CODIGO_PRODUCTO}</td>
                            <td>{producto.CANTIDAD}</td>
                            <td>{producto.PRECIO_TOTAL}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="3" style={{ textAlign: 'right' }}><strong>Total a pagar:</strong></td>
                        <td>{boleta.productos.reduce((acc, producto) => acc + producto.PRECIO_TOTAL, 0)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

export default MostrarBoleta;
