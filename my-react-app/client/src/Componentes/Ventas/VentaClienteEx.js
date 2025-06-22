import React, { useState, useEffect } from 'react';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import Modal from 'react-modal';
import VentasPendientes from "../Pendientes/VentasPendientes";
import authenticatedFetch from '../../utils/api';
import { useNavigate } from 'react-router-dom';

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
    const [selectedImage, setSelectedImage] = useState(null);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState('');
    const currentUserRut = localStorage.getItem('userRut');
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        document.title = 'Venta Cliente Existente';
        const allowedRoles = ['Administrador', 'Vendedor'];

        if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
            navigate('/login');
        }
    }, [userRole, navigate]);

    const handleSubmitCliente = async (e) => {
        e.preventDefault();
        try {
            const response = await authenticatedFetch('/insertCabecera', {
                method: 'POST',
                body: {codigo, currentUserRut }
            });

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userRut');
                navigate('/login');
                return;
            }

            if (response.ok) {
                const data = await response.json();
                setClienteData(data);
                setPaginaActual('buscarProducto');
            } else {
                const errorData = await response.json();
                setModalMessage(errorData.message);
                setModalType('error');
                setClienteData(null);
                setMessageModalIsOpen(true);
            }
        } catch (error) {
            console.error('Error al ingresar datos:', error);
            setModalMessage('Error al ingresar datos.');
            setModalType('error');
            setMessageModalIsOpen(true);
        }
    };

    const buscarProductos = async (event) => {
        event.preventDefault();

        try {
            const response = await authenticatedFetch('/buscarProducto', {
                method: 'POST',
                body: ({
                    'input-nombre': nombre,
                    'input-color': color,
                }),
            });

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userRut');
                navigate('/login');
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error en la solicitud');
            }

            const data = await response.json();

            if (data.data && data.data.length > 0) {
                setProductos(data.data);
            } else {
                setModalMessage('No se encontraron productos con los criterios de búsqueda.');
                setModalType('error');
                setMessageModalIsOpen(true);
                setProductos([]);
            }
        } catch (error) {
            console.error('Error al buscar productos:', error);
            setModalMessage(error.message || 'Error al buscar productos.');
            setModalType('error');
            setMessageModalIsOpen(true);
            setProductos([]);
        }
    };

    const añadirAlCarrito = (producto) => {
        const cantidadSeleccionada = cantidad[producto.codigo_producto] || 0;

        if (cantidadSeleccionada <= 0) {
            setModalMessage("La cantidad debe ser mayor que cero.");
            setModalType('error');
            setMessageModalIsOpen(true);
            return;
        }

        if (cantidadSeleccionada > producto.stock) {
            setModalMessage("Stock insuficiente.");
            setModalType('error');
            setMessageModalIsOpen(true);
            return;
        }

        setCarrito((prevCarrito) => {
            const existente = prevCarrito.find(p => p.codigo_producto === producto.codigo_producto);
            if (existente) {
                const nuevaCantidad = existente.cantidad + cantidadSeleccionada;
                if (nuevaCantidad > producto.stock) {
                    setModalMessage("La cantidad total en el carrito excede el stock disponible.");
                    setModalType('error');
                    setMessageModalIsOpen(true);
                    return prevCarrito;
                }
                return prevCarrito.map(p =>
                    p.codigo_producto === producto.codigo_producto
                        ? { ...p, cantidad: nuevaCantidad }
                        : p
                );
            }
            return [...prevCarrito, { ...producto, cantidad: cantidadSeleccionada }];
        });

        setCantidad(prevState => ({ ...prevState, [producto.codigo_producto]: 0 }));
    };

    const finalizarVenta = async () => {
        if (carrito.length === 0) {
            setModalMessage("El carrito está vacío. Agregue productos antes de finalizar la venta.");
            setModalType('error');
            setMessageModalIsOpen(true);
            return;
        }

        const productosVenta = carrito.map(producto => ({
            codigo: producto.codigo_producto,
            cantidad: producto.cantidad
        }));

        try {
            const response = await authenticatedFetch('/insertCuerpo', {
                method: 'POST',
                body: ({ productos: productosVenta }),
            });

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userRut');
                navigate('/login');
                return;
            }

            if (response.ok) {
                const data = await response.json();
                setModalMessage("Venta finalizada exitosamente.");
                setModalType('exito');
                setMessageModalIsOpen(true);
                setCarrito([]);
                setPaginaActual('VentasPendientes');
            } else {
                const errorData = await response.json();
                setModalMessage(errorData.message);
                setModalType('error');
                setMessageModalIsOpen(true);
            }
        } catch (error) {
            console.error('Error al finalizar la venta:', error);
            setModalMessage('Error al finalizar la venta.');
            setModalType('error');
            setMessageModalIsOpen(true);
        }
    };

    const handleCantidadChange = (codigoProducto, value) => {
        setCantidad(prevState => ({
            ...prevState,
            [codigoProducto]: value
        }));
    };

   const mostrarImagen = (codigoProducto) => {
        // Se cambió para forzar la extensión a .jpg, ya que el backend la guarda así.
        const imageUrl = `/images/Outlet/${codigoProducto}.jpg`; 
        console.log('En front, URL de la imagen:', imageUrl);
        setSelectedImage(imageUrl);
        setImageModalIsOpen(true);
    };

    const closeModal = () => {
        setImageModalIsOpen(false);
        setMessageModalIsOpen(false);
    };

    const allowedRoles = ['Administrador', 'Vendedor'];
    if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
        return (
            <div className="main-block">
                <h1>Redirigiendo...</h1>
            </div>
        );
    }

    return (
        <>
        {paginaActual !== 'VentasPendientes' && (
        <div className="main-block">
            {paginaActual === 'insertCabecera' && (
                <>
                    <form onSubmit={handleSubmitCliente}>
                        <h1>Cabecera Venta</h1>
                        <fieldset>
                            <h3>Buscar Cliente</h3>
                            <div className="account-details" style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>
                                    <label>Código cliente*</label>
                                    <input
                                        type="text"
                                        name="input-cod"
                                        pattern="[0-9]+"
                                        maxLength="5"
                                        required
                                        value={codigo}
                                        onChange={(e) => setCodigo(e.target.value)}
                                    />
                                </div>
                            </div>
                        </fieldset>
                        <button type="submit">Buscar Cliente</button>
                    </form>
                </>
            )}

            {paginaActual === 'buscarProducto' && (
                <>
                    <h1>Buscar Producto</h1>
                    <form onSubmit={buscarProductos}>
                        <fieldset>
                            <h3>Búsqueda</h3>
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
                                        maxLength="15"
                                        pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$"
                                        onChange={(e) => setColor(e.target.value)}
                                        placeholder="Color del producto"
                                    />
                                </div>
                            </div>
                        </fieldset>
                        <button type="submit">Buscar Producto</button>
                    </form>

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
                        <button onClick={closeModal} className="close-buttonImagen">&times;</button>
                    </Modal>

                    {productos.length > 0 && (
                        <fieldset>
                            <h3>Resultados</h3>
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
                                                <button type="button" onClick={() => mostrarImagen(producto.codigo_producto)} className={"btn mini-boton"}>
                                                    <i className="fa fa-eye"></i>
                                                </button>
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    style={{ width: '50px' }}
                                                    value={cantidad[producto.codigo_producto] || 0}
                                                    onChange={(e) => handleCantidadChange(producto.codigo_producto, parseInt(e.target.value) || 0)}
                                                />
                                            </td>
                                            <td>
                                                <button onClick={() => añadirAlCarrito(producto)} className={"btn mini-boton"}>
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
                </>
            )}
            </div>
            )}
            {paginaActual === 'VentasPendientes' && (
                <>
                    <VentasPendientes />
                </>
            )}

            <Modal isOpen={messageModalIsOpen} onRequestClose={closeModal} ariaHideApp={false} className={`custom-modal ${modalType === 'error' ? 'modal-error' : 'modal-exito'}`}>
                <h2>Mensaje</h2>
                <p>{modalMessage}</p>
                <button onClick={closeModal} className={`modal-button ${modalType === 'error' ? 'btn-error' : 'btn-exito'}`}>Cerrar</button>
            </Modal>
            </>
        
    );
}

export default VentaClienteEx;