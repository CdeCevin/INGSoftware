import React, { useState, useEffect } from 'react';
import '../../Estilos/estilo.css';
function HistorialVentas() {
    const [ventas, setVentas] = useState([]);
    const [visibleTables, setVisibleTables] = useState({});

    // Fetch and sort data
    useEffect(() => {
        fetch('http://localhost:3001/api/historialVentas/historialVentas') // Reemplaza con tu endpoint
            .then(response => response.json())
            .then(data => {
                const sortedData = data.sort((a, b) => b.codigoComprobante - a.codigoComprobante);
                setVentas(sortedData);
            })
            .catch(error => console.error('Error al obtener ventas:', error));
    }, []);

    useEffect(() => {
        document.title = 'Historial de Ventas';
    }, []);

    const handleButtonClick = (idVenta) => {
        setVisibleTables((prevState) => ({
            ...prevState,
            [idVenta]: !prevState[idVenta],
        }));
    };

    const handleVerBoleta = (codigoComprobante) => {
        // No fetch or sessionStorage here! Just open the new window with the correct URL
        const comprobanteUrl = `${window.location.origin}/comprobante/${codigoComprobante}`; // <--- NEW URL FORMAT
        window.open(comprobanteUrl, '_blank', 'noopener,noreferrer');
    };

    return (
            <div className="main-block">
                <h1 /*style={{padding:20}}*/>Historial de Ventas</h1>
                {ventas.length > 0 ? (
                    ventas.map((venta) => (
                        <div key={venta.codigoComprobante} className="venta-block" /*style={{paddingTop:0}}*/>
                            <table className="venta-table" /* style={{marginLeft:'8%'}}*/>
                                <thead>
                                    <tr>
                                        <th>CÓDIGO DE <br></br> VENTA</th>
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
                                        <td className='venta-cell'>{new Date(venta.fecha).toLocaleDateString()}</td> {/* Formatea la fecha */}
                                        <td className='venta-cell'>{venta.nombreCliente}</td>
                                        <td className='venta-cell'>{`${venta.direccionCalle} ${venta.numeroDireccion}, ${venta.ciudad}, ${venta.region}`}</td>
                                        <td className='venta-cell'>
                                            <button className='btn_Pendientes' onClick={() => handleButtonClick(venta.codigoComprobante)}>
                                                {visibleTables[venta.codigoComprobante] ? "Cerrar Productos" : "Ver Productos"}
                                            </button>
                                            {visibleTables[venta.codigoComprobante] && (
                                                <table style={{ borderCollapse: 'collapse' }}>
                                                    <tbody>
                                                        {venta.productos && venta.productos.length > 0 ? (
                                                            venta.productos.map((producto, prodIndex) => (
                                                                <li key={prodIndex}>{producto}</li>
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
                                        <td className='venta-cell'>${venta.precioTotal}</td>
                                        <td>
                                            {/* Botón para ver la boleta */}
                                            <button
                                            type="button"
                                            onClick={() => handleVerBoleta(venta.codigoComprobante)}
                                            className="btn btn-primary">
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
            </div>
    );
}

export default HistorialVentas;
