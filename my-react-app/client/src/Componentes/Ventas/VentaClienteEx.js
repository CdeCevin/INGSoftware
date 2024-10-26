import React, { useState } from 'react';
import Modal from 'react-modal';

function VentaClienteEx() {
    const [codigo, setCodigo] = useState('');
    const [clienteData, setClienteData] = useState(null);
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [modalMessage, setModalMessage] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [paginaActual, setPaginaActual] = useState('Cabecera'); // Controla la página actual

    const handleSubmitCliente = async (e) => {
        e.preventDefault();
        try {
            console.log("El código es:", codigo);
            const response = await fetch(`http://localhost:3001/api/insertCabecera`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ codigo })
            });

            if (response.ok) {
                const data = await response.json();
                setClienteData(data);
                setModalMessage('Cliente encontrado');
                setModalIsOpen(false);
                setPaginaActual('carrito'); // Cambia a la página de búsqueda de productos
            } else {
                const errorData = await response.json();
                setModalMessage(errorData.message);
                setClienteData(null);
                setModalIsOpen(true);
            }
        } catch (error) {
            console.error('Error al buscar cliente:', error);
            setModalMessage('Error al buscar cliente.');
            setModalIsOpen(true);
        }
    };

    const buscarProductos = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/buscarProducto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ codigo }) // Cambia este parámetro según lo que necesites para buscar productos
            });

            if (!response.ok) throw new Error('Error en la solicitud');
            const data = await response.json();
            if (data.data && data.data.length > 0) {
                setProductos(data.data);
            } else {
                setModalMessage("No se encontraron productos");
                setModalIsOpen(true);
            }
        } catch (error) {
            console.error('Error al buscar productos:', error);
            setModalMessage('Error al buscar productos.');
            setModalIsOpen(true);
        }
    };

    const añadirAlCarrito = (producto) => {
        setCarrito([...carrito, { ...producto, cantidad: 1 }]); // Añade el producto con cantidad inicial de 1
    };

    const finalizarVenta = () => {
        // Aquí puedes hacer el proceso de finalizar la venta (como enviarlo al backend)
        console.log("Venta finalizada:", carrito);
        setModalMessage("Venta finalizada exitosamente");
        setModalIsOpen(true);
        setCarrito([]); // Limpia el carrito al finalizar la venta
        setPaginaActual('Cabecera'); // Regresa al formulario inicial
    };

    const closeModal = () => setModalIsOpen(false);

    return (
        <div style={{ marginLeft: '12%' }}>
            {paginaActual === 'Cabecera' && (
                <div className="main-block">
                    <form onSubmit={handleSubmitCliente}>
                        <h1>Venta Producto</h1>
                        <fieldset>
                            <legend>
                                <h3>Cliente Antiguo</h3>
                            </legend>
                            <div className="account-details" style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>
                                    <label>Código cliente*</label>
                                    <input 
                                        type="text" 
                                        name="input-cod" 
                                        pattern="[0-9]+" 
                                        maxLength="4" 
                                        required 
                                        value={codigo} 
                                        onChange={(e) => setCodigo(e.target.value)} 
                                    />
                                </div>
                            </div>
                        </fieldset>
                        <button type="submit">Buscar Cliente</button>
                    </form>
                </div>
            )}

            {paginaActual === 'carrito' && (
                <div className="main-block">
                    <h1>Buscar Producto</h1>
                    <form onSubmit={buscarProductos}>
                        <fieldset>
                            <legend>
                                <h3>Detalles del Producto</h3>
                            </legend>
                            <div className="account-details" style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>
                                    <label>Código producto*</label>
                                    <input type="text" name="input-producto" required />
                                </div>
                            </div>
                        </fieldset>
                        <button type="submit">Buscar Producto</button>
                    </form>
                    
                    {productos.length > 0 && (
                        <table className="venta-table">
                            <thead>
                                <tr>
                                    <th>CÓDIGO</th>
                                    <th>STOCK</th>
                                    <th>PRECIO</th>
                                    <th>NOMBRE</th>
                                    <th>AÑADIR</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map((producto) => (
                                    <tr key={producto.codigo_producto}>
                                        <td>{producto.codigo_producto}</td>
                                        <td>{producto.stock}</td>
                                        <td>{producto.precio_unitario}</td>
                                        <td>{producto.nombre_producto}</td>
                                        <td>
                                            <button onClick={() => añadirAlCarrito(producto)}>Añadir al Carrito</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {carrito.length > 0 && (
                        <div>
                            <h2>Carrito de Compras</h2>
                            <ul>
                                {carrito.map((producto, index) => (
                                    <li key={index}>
                                        {producto.nombre_producto} - Cantidad: {producto.cantidad} - Precio: ${producto.precio_unitario}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={finalizarVenta}>Finalizar Venta</button>
                        </div>
                    )}
                </div>
            )}

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Mensaje">
                <h2>Mensaje</h2>
                <p>{modalMessage}</p>
                <button onClick={closeModal}>Cerrar</button>
            </Modal>
        </div>
    );
}

export default VentaClienteEx;
