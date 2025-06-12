import React, { useState, useEffect } from 'react';
import './HistorialVentas.css'; // Asegúrate de tener este archivo CSS

function HistorialVentas() {
    const [ventas, setVentas] = useState([]);
    const [visibleTables, setVisibleTables] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [boletaData, setBoletaData] = useState(null);
    const [loadingBoleta, setLoadingBoleta] = useState(false);
    const [errorBoleta, setErrorBoleta] = useState(null);

    // Obtener el rol y RUT del usuario logueado desde localStorage
    // Estas líneas son correctas aquí, pero su uso principal será en otro lugar
    // para control de acceso, no necesariamente dentro del modal de boleta.
    // La boleta mostrará el RUT del VENDEDOR que hizo la venta, no del usuario actual.
    const currentUserRole = localStorage.getItem('userRole');
    const currentUserRut = localStorage.getItem('userRut');

    console.log('Rol del usuario actual:', currentUserRole);
    console.log('RUT del usuario actual:', currentUserRut);
    // console.log('¿Es administrador?', currentUserRole === 'Administrador');
    // console.log('¿Es vendedor?', currentUserRole === 'Vendedor');


    useEffect(() => {
        fetch('http://localhost:3001/api/historialVentas') // Reemplaza con tu endpoint
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

    const handleProductsButtonClick = (idVenta) => { // Renombrado a handleProductsButtonClick para mayor claridad
        setVisibleTables((prevState) => ({
            ...prevState,
            [idVenta]: !prevState[idVenta],
        }));
    };

    const handleShowBoleta = async (codigoComprobante) => {
        setLoadingBoleta(true);
        setErrorBoleta(null);
        try {
            const response = await fetch(`http://localhost:3001/api/historialVentas/boleta/${codigoComprobante}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setBoletaData(data);
            setShowModal(true);
        } catch (error) {
            console.error('Error al obtener la boleta:', error);
            setErrorBoleta('No se pudo cargar la boleta. Inténtalo de nuevo.');
        } finally {
            setLoadingBoleta(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setBoletaData(null); // Limpiar datos al cerrar el modal
        setErrorBoleta(null);
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
                                        <td className='venta-cell'>{new Date(venta.fecha).toLocaleDateString()}</td>
                                        <td className='venta-cell'>{venta.nombreCliente}</td>
                                        <td className='venta-cell'>{`${venta.direccionCalle} ${venta.numeroDireccion}, ${venta.ciudad}, ${venta.region}`}</td>
                                        <td className='venta-cell'>
                                            <button className='btn_Pendientes' onClick={() => handleProductsButtonClick(venta.codigoComprobante)}>
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
                                                disabled={loadingBoleta}
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
                                <p>
                                    <strong>Vendedor:</strong> {boletaData.cabecera.NOMBRE_USUARIO}
                                    {/* Muestra el RUT del Vendedor que realizó la venta */}
                                    {boletaData.cabecera.RUT_USUARIO && ` (${boletaData.cabecera.RUT_USUARIO})`}
                                </p>

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
                                                <td>${prod[3].toLocaleString('es-CL')}</td>
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