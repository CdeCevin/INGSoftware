import React, { useState, useEffect } from 'react';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import Modal from 'react-modal';
import VentasPendientes from "../Pendientes/VentasPendientes"; // Asegúrate de importar el nuevo componente"
function VentaClienteEx() {
    const [codigo, setCodigo] = useState('');
    const [clienteData, setClienteData] = useState(null);
    const [nombre, setNombre] = useState('');
    const [color, setColor] = useState('');
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [cantidad, setCantidad] = useState({});
    const [paginaActual, setPaginaActual] = useState('insertCabecera');
    
    const [imageModalIsOpen, setImageModalIsOpen] = useState(false);
    const [messageModalIsOpen, setMessageModalIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);  // Aquí va la imagen seleccionada
    const [modalMessage, setModalMessage] = useState("");      
    const currentUserRut = localStorage.getItem('userRut');


    const handleSubmitCliente = async (e) => {
        e.preventDefault();
        try {
            console.log("El código es:", codigo);
            const response = await fetch(`http://localhost:3001/api/insertCabecera`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ codigo, currentUserRut })
            });

            if (response.ok) {
                const data = await response.json();
                setClienteData(data);
                setPaginaActual('buscarProducto');
            } else {
                const errorData = await response.json();
                setModalMessage(errorData.message);
                setClienteData(null);
                setMessageModalIsOpen(true);
            }
        } catch (error) {
            console.error('Error al ingresar datos:', error);
            setModalMessage('Error al ingresar datos.');
            setMessageModalIsOpen(true);
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
                setProductos(data.data);
            } else {
                setModalMessage('Error al buscar producto.');
                setMessageModalIsOpen(true);
            }
        } catch (error) {
            console.error('Error al buscar productos:', error);
            setMessageModalIsOpen(true);
        }
    };

    const añadirAlCarrito = (producto) => {
        console.log("producto:", producto);
    
        // Obtener cantidad seleccionada
        const cantidadSeleccionada = cantidad[producto.codigo_producto] || 0;
    
        // Validar stock antes de modificar el carrito
        if (cantidadSeleccionada > producto.stock) {
            console.error('Stock insuficiente');
            setModalMessage("Stock insuficiente");
            setMessageModalIsOpen(true);
            return; // Detener ejecución si no hay suficiente stock
        }
    
        // Actualizar el carrito solo si hay stock suficiente
        setCarrito((prevCarrito) => {
            const existente = prevCarrito.find(p => p.codigo_producto === producto.codigo_producto);
            if (existente) {
                // Actualizar cantidad si el producto ya está en el carrito
                return prevCarrito.map(p =>
                    p.codigo_producto === producto.codigo_producto
                        ? { ...p, cantidad: p.cantidad + cantidadSeleccionada }
                        : p
                );
            }
            // Agregar el producto al carrito si no existe
            return [...prevCarrito, { ...producto, cantidad: cantidadSeleccionada }];
        });
    
        // Reiniciar la cantidad seleccionada para el producto
        setCantidad(prevState => ({ ...prevState, [producto.codigo_producto]: 0 }));
    };
    

    const finalizarVenta = async () => {
        const productosVenta = carrito.map(producto => ({
            codigo: producto.codigo_producto,
            cantidad: producto.cantidad
        }));

        try {
            const response = await fetch('http://localhost:3001/api/insertCuerpo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productos: productosVenta }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Respuesta de la API:', data);
                setModalMessage("Venta finalizada exitosamente");
                setMessageModalIsOpen(false);
                setCarrito([]);
                setPaginaActual('VentasPendientes'); // Cambia a la página de la boleta
            } else {
                const errorData = await response.json();
                setModalMessage(errorData.message);
                setMessageModalIsOpen(true);
            }
        } catch (error) {
            console.error('Error al finalizar la venta:', error);
            setModalMessage('Error al finalizar la venta.');
            setMessageModalIsOpen(true);
        }
    };
    
    const handleCantidadChange = (codigoProducto, value) => {
        setCantidad(prevState => ({
            ...prevState,
            [codigoProducto]: value
        }));
    };


    const mostrarImagen = (codigo_producto) => {
        const imageUrl = `/images/Outlet/${codigo_producto}.jpg`; // Ruta relativa de la imagen
        setSelectedImage(imageUrl);  // Establecer la URL de la imagen seleccionada
        setImageModalIsOpen(true);   // Abrir el modal de imagen
        console.log("Imagen mostrada:", imageUrl); // Para asegurarte de que se está estableciendo la imagen
    };
    
    const closeModal = () => {
        setImageModalIsOpen(false);   // Cerrar solo el modal de la imagen
        setMessageModalIsOpen(false); // Cerrar solo el modal de mensaje
    };

    useEffect(() => {
        document.title = 'Venta Cliente Existente';
    }, []);
    return (

        <div className="main-block">
            {paginaActual === 'insertCabecera' && (
                <div className="main-block">
                    <form onSubmit={handleSubmitCliente}>
                        <h1>Cabecera Venta</h1>
                        <fieldset>
                            <legend>
                                <h3>Buscar Cliente</h3>
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
                                <h3>Búsqueda</h3>
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
                    

                    {/* Modal para mostrar la imagen seleccionada */}
                    <Modal isOpen={imageModalIsOpen} onRequestClose={closeModal} contentLabel="Imagen del Producto" className={"custom-modal"}>
                    <h2>Imagen del Producto</h2>
                    {selectedImage ? (
                      <img
                        src={selectedImage}
                        alt="Imagen del producto"
                        style={{
                          display: 'block',
                          margin: '0 auto',
                          maxWidth: '80%',
                          height: 'auto',
                          maxHeight: '400px'
                        }}
                      />
                    ) : (
                      <p>No se ha seleccionado una imagen.</p>
                    )}
                    <button onClick={closeModal}>Cerrar</button>
                  </Modal>

                    {productos.length > 0 && (
                        <fieldset>
                        <legend>
                            <h3>Resultados</h3>
                        </legend>
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
                                {productos.filter(producto => producto.stock > 0).map((producto) => ( 
                                    <tr key={producto.codigo_producto}>
                                        <td>{producto.codigo_producto}</td>
                                        <td>{producto.stock}</td>
                                        <td>{producto.precio_unitario}</td>
                                        <td>{producto.nombre_producto}</td>
                                        <td>{producto.color_producto}</td>
                                        <td>
                                        {/* Botón para ver la imagen */}
                                        <button type="button" onClick={() => mostrarImagen(producto.codigo_producto)} className={"btn btn-primary"}>
                                            <i className="fa fa-eye"></i>
                                        </button>
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                min="1"
                                                style={{ width: '50px' }}
                                                value={cantidad[producto.codigo_producto] || 0}
                                                onChange={(e) => handleCantidadChange(producto.codigo_producto, parseInt(e.target.value) || 0)}
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
                        <button onClick={finalizarVenta}>Finalizar Venta</button>
                        </fieldset>
                    )}
                    {/* 
                    {carrito.length > 0 && (
                        <div>
                            <h2>Carrito de Compras</h2>
                            <ul>
                                {carrito.map((producto, index) => (
                                    <li key={index}>
                                        {producto.nombre_producto} - Cantidad: {producto.cantidad} - Precio: ${producto.precio_unitario}
                                    </li>
                                ))}
                            </ul></div>)}*/}
                </div>
            )}

            {paginaActual === 'VentasPendientes' && (
                <div className="main-block">
                <VentasPendientes />
                </div>
            )}

            <Modal isOpen={messageModalIsOpen} onRequestClose={closeModal} ariaHideApp={false} className={"custom-modal"}>
                <h2>Mensaje</h2>
                <p>{modalMessage}</p>
                <button onClick={closeModal}>Cerrar</button>
            </Modal>
        </div>
    );
}

export default VentaClienteEx;
