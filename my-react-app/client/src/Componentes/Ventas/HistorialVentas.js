import React, { useState, useEffect } from 'react';

function HistorialVentas() {
    const [ventas, setVentas] = useState([]);
    const [visibleTables, setVisibleTables] = useState({});
    // En otro componente, por ejemplo, en la barra de navegación o un componente de perfil
    const role = localStorage.getItem('userRole');
    const userRut = localStorage.getItem('userRut'); // Obtienes el RUT del localStorage

    const isAdmin = role === 'Administrador';
    const isVendedor = role === 'Vendedor';

    console.log('Rol del usuario:', role);
    console.log('RUT del usuario:', userRut);
    console.log('¿Es administrador?', isAdmin);
    console.log('¿Es vendedor?', isVendedor);
    
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

    return (
        <div style={{ marginLeft: '13%' }}>
            <div className="main-block">
                <h1 style={{padding:20}}>Historial de Ventas</h1>
            
                {ventas.length > 0 ? (
                    ventas.map((venta) => (
                        <div key={venta.codigoComprobante} className="venta-block" style={{paddingTop:0}}>
                            <table className="venta-table" style={{marginLeft:'8%'}}>
                                <thead>
                                    <tr>
                                        <th>CÓDIGO DE VENTA</th>
                                        <th>FECHA</th>
                                        <th>CLIENTE</th>
                                        <th>DIRECCIÓN</th>
                                        <th>PRODUCTOS</th>
                                        <th>TOTAL</th>
                                        <th>BOLETA</th>
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
                                        <td className='venta-cell'>{venta.precioTotal}</td>
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() => handleShowBoleta(venta.codigoComprobante)}
                                                className="btn btn-primary"
                                                disabled={loadingBoleta} // Deshabilita el botón mientras carga
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
            </div>

            {/* Modal para mostrar la boleta */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close-button" onClick={handleCloseModal}>X</button>
                        <h2>Boleta de Venta #{boletaData?.codigoCabecera}</h2>
                        {loadingBoleta && <p>Cargando boleta...</p>}
                        {errorBoleta && <p style={{ color: 'red' }}>{errorBoleta}</p>}
                        {boletaData && (
                            <div>
                                <h3>Detalles del Cliente</h3>
                                <p><strong>Cliente:</strong> {boletaData.cabecera.NOMBRE_CLIENTE}</p>
                                <p><strong>Teléfono:</strong> {boletaData.cabecera.TELEFONO}</p>
                                <p><strong>Fecha:</strong> {new Date(boletaData.cabecera.FECHA).toLocaleDateString()} {new Date(boletaData.cabecera.FECHA).toLocaleTimeString()}</p>
                                <p><strong>Dirección:</strong> {`${boletaData.direccion.nombreCalle} ${boletaData.direccion.numeroDireccion}, ${boletaData.direccion.nombreCiudad}, ${boletaData.direccion.nombreRegion}`}</p>
                                <p><strong>Vendedor:</strong> {boletaData.cabecera.NOMBRE_USUARIO} ({boletaData.cabecera.RUT_USUARIO})</p>

                                <h3>Productos</h3>
                                <table className="boleta-products-table">
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Color</th>
                                            <th>Cantidad</th>
                                            <th>Precio Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {boletaData.productos.map((prod, index) => (
                                            <tr key={index}>
                                                <td>{prod[0]}</td>
                                                <td>{prod[1]}</td>
                                                <td>{prod[2]}</td>
                                                <td>${prod[3].toLocaleString('es-CL')}</td> {/* Formato de moneda chilena */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <p className="total-boleta"><strong>Total General:</strong> ${boletaData.productos.reduce((acc, prod) => acc + prod[3], 0).toLocaleString('es-CL')}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default HistorialVentas;
