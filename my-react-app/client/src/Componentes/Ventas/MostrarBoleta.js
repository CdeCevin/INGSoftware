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
            <fieldset>
            <legend>
            <h3>Boleta</h3>
            </legend>
            <table border="1" cellpadding="8" style={{borderCollapse:'collapse', width: '80%'}}>
            <tr>
            <div style={{fontSize: '18px',paddingLeft: '10px',paddingTop: '10px'}}><strong>  Nombrx:</strong> {boleta.cabecera.NOMBRE_CLIENTE}</div>
            <div style={{fontSize: '18px',paddingLeft: '10px'}}><strong>  Teléfono:</strong> {boleta.cabecera.TELEFONO}</div>
            <div style={{fontSize: '18px',paddingLeft: '10px'}}><strong>  Dirección:</strong> {`${boleta.direccion.nombreRegion}, ${boleta.direccion.nombreCiudad}, ${boleta.direccion.nombreCalle} #${boleta.direccion.numeroDireccion}`}</div>
            <div style={{fontSize: '18px',paddingLeft: '10px'}}><strong>  Fecha:</strong> {boleta.cabecera.FECHA.split('T')[0]}</div>
            <div style={{fontSize: '18px',paddingLeft: '10px',paddingBottom: '10px'}}><strong>  Número Boleta:</strong> {boleta.codigoCabecera}</div>
            
            <table border="1" cellpadding="8" style={{ borderRight:'none', borderLeft: 'none', borderBottom: 'none', borderCollapse: 'collapse', width: '100%'}}> 
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
                        <tr style={{ textAlign: 'center' }} key={index}>
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
                        <td colSpan="4" style={{ textAlign: 'right' }}><strong>Total a pagar:</strong></td>
                        <td>{boleta.productos.reduce((acc, producto) => acc + producto[3], 0)}</td> {/* Precio Total */}
                    </tr>
                </tfoot>
            </table>
            
            </tr>
            </table>
            </fieldset>
        </div>
       
    );
}

export default Boleta;
