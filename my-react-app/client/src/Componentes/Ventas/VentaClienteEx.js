import React, { useState } from 'react';
import Modal from 'react-modal';

function VentaClienteEx() {
    const [codigo, setCodigo] = useState('');
    const [clienteData, setClienteData] = useState(null);
    const [nombre, setNombre] = useState('');
    const [color, setColor] = useState('');
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [modalMessage, setModalMessage] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [cantidad, setCantidad] = useState({}); // Estado para almacenar cantidades de cada producto
    const [paginaActual, setPaginaActual] = useState('insertCabecera'); // Controla la página actual

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
                setPaginaActual('buscarProducto'); // Cambia a la página de búsqueda de productos
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
                body: JSON.stringify({
                    'input-nombre': nombre,
                    'input-color': color,
                }),
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }

            const data = await response.json();

            if (data.data && data.data.length > 0) {
                setProductos(data.data); // Si hay productos, actualiza el estado pero NO abre el modal
            } else {
                //setSelectedImage(null); // Asegurarse de que no haya imagen seleccionada
                setModalIsOpen(true); // Abre el modal si no se encuentran productos
            }
        } catch (error) {
            console.error('Error al buscar productos:', error);
            setModalIsOpen(true); // Abre el modal si ocurre un error
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
        setPaginaActual('insertCabecera'); // Regresa al formulario inicial
    };
    
    const handleCantidadChange = (codigoProducto, value) => {
        setCantidad(prevState => ({
            ...prevState,
            [codigoProducto]: value // Almacena la cantidad específica para cada producto
        }));
    };

    const closeModal = () => setModalIsOpen(false);

    return (
        <div style={{ marginLeft: '12%' }}>
            {paginaActual === 'insertCabecera' && (
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

            {paginaActual === 'buscarProducto' && (
                <div className="main-block">
                    <h1>Buscar Producto</h1>
                    <form onSubmit={buscarProductos}>
                        <fieldset>
                            <legend>
                                <h3>Detalles del Producto</h3>
                            </legend>
                            <div className="account-details" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div>
                                <label>Nombre*</label>
                                <input
                                    type="text"
                                    name="input-nombre"
                                    maxLength="50"
                                    required
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    placeholder="Nombre del producto"
                                />
                            </div>
                            <div>
                                <label>Color</label>
                                <input
                                    type="text"
                                    name="input-color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    placeholder="Color del producto"
                                />
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
                                    <th>COLOR</th>
                                    <th>FOTO</th>
                                    <th>CANTIDAD</th>
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
                                        <td>{producto.color_producto}</td>
                                        <td>
                                            <input
                                                type="number"
                                                min="1"
                                                style={{ width: '50px' }}
                                                value={cantidad[producto.codigo_producto] || 1}
                                                onChange={(e) => handleCantidadChange(producto.codigo_producto, parseInt(e.target.value))}
                                            />
                                        </td>
                                        <td>
                                            <button onClick={() => añadirAlCarrito(producto)}>
                                                <i className="fa fa-shopping-cart"></i>
                                            </button>
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




































/** import React, { useState } from 'react';
import Modal from 'react-modal';

function VentaClienteEx() {
    const [codigo, setCodigo] = useState('');
    const [clienteData, setClienteData] = useState(null);
    const [modalMessage, setModalMessage] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [paginaActual, setPaginaActual] = useState('insertCabecera'); // Estado para controlar la página actual

    const handleSubmit = async (e) => {
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
                setPaginaActual('nuevaBusqueda'); // Cambia la página al nuevo formulario
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

    const closeModal = () => setModalIsOpen(false);

    return (
        <div style={{ marginLeft: '12%' }}>
            {paginaActual === 'insertCabecera' ? (
                <div className="main-block">
                    <form onSubmit={handleSubmit}>
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
                        <button type="submit">Buscar</button>
                    </form>
                </div>
            ) : (
                <div className="main-block">
                    <h1>Nueva Búsqueda</h1>
                    <form>
                        <fieldset>
                        <legend>
                            <h3>Formulario de Ejemplo</h3>
                        </legend>
                            <div className="account-details" style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>
                                    <label>Parámetro de búsqueda*</label>
                                    <input type="text" name="input-param" required />
                                </div>
                            </div>
                        </fieldset>
                        <button type="submit">Buscar</button>
                    </form>
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
 */