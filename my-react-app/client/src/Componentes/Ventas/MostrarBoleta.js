import React, { useState, useEffect } from 'react';

function Boleta() {
    const [boleta, setBoleta] = useState(null);

    useEffect(() => {
        const fetchBoleta = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/boleta');
                if (response.ok) {
                    const data = await response.json();
                    setBoleta(data);
                } else {
                    console.error('Error al obtener la boleta:', response.statusText);
                }
            } catch (error) {
                console.error('Error al hacer la solicitud:', error);
            }
        };

        fetchBoleta();
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
                            <td>{producto[0]}</td>
                            <td>{producto[1]}</td> 
                            <td>{producto[4]}</td> 
                            <td>{producto[2]}</td> 
                            <td>{producto[3]}</td> 
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="3" style={{ textAlign: 'right' }}><strong>Total a pagar:</strong></td>
                        <td>{boleta.productos.reduce((acc, producto) => acc + producto[3], 0)}</td> {/* Precio Total */}
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

export default Boleta;
