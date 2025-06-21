import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import VentasPendientes from '../Pendientes/VentasPendientes';
import optionSets from '../../Estilos/regiones';
import authenticatedFetch from '../../utils/api';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');
function VentaClienteNu() {
    const [nombreC, setNombreC] = useState('');
    const [telefono, setTelefono] = useState('');
    const [region, setRegion] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [calle, setCalle] = useState('');
    const [numero, setNumero] = useState('');
    const [nombre, setNombre] = useState('');
    const [color, setColor] = useState('');
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);

    const [imageModalIsOpen, setImageModalIsOpen] = useState(false);
    const [messageModalIsOpen, setMessageModalIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [modalMessage, setModalMessage] = useState("");

    const [cantidad, setCantidad] = useState({});
    const [paginaActual, setPaginaActual] = useState('insertCabecera');
    const currentUserRut = localStorage.getItem('userRut');
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        document.title = 'Venta Cliente Nuevo';
        const allowedRoles = ['Administrador', 'Vendedor'];
        if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
            navigate('/login');
        }
    }, [userRole, navigate]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            INnombre: nombreC,
            INtelefono: telefono,
            INregion: region,
            INciudad: ciudad,
            INcalle: calle,
            INnumero: numero,
            currentUserRut: currentUserRut
        };

        try {
            const response = await authenticatedFetch('/anCliente', {
                method: 'POST',
                body: (formData)
            });

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userRut');
                navigate('/login');
                return;
            }

            if (response.ok) {
                resetForm();
                setPaginaActual('buscarProducto');
            } else {
                const errorData = await response.json();
                setModalMessage(errorData.message);
                setMessageModalIsOpen(true);
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            setModalMessage('Error al enviar el formulario.');
            setMessageModalIsOpen(true);
        }
    };


    const resetForm = () => {
        setNombreC('');
        setRegion('');
        setCiudad('');
        setCalle('');
        setNumero('');
    };


    const handleRegionChange = (e) => {
        setRegion(e.target.value);
        setCiudad('');
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
                setModalMessage("No se encontraron productos con los criterios de búsqueda.");
                setMessageModalIsOpen(true);
                setProductos([]);
            }
        } catch (error) {
            console.error('Error al buscar productos:', error);
            setModalMessage(error.message || "Error al buscar productos");
            setMessageModalIsOpen(true);
            setProductos([]);
        }
    };

    const añadirAlCarrito = (producto) => {
        const cantidadSeleccionada = cantidad[producto.codigo_producto] || 0;

        if (cantidadSeleccionada <= 0) {
            setModalMessage("La cantidad debe ser mayor que cero.");
            setMessageModalIsOpen(true);
            return;
        }

        if (cantidadSeleccionada > producto.stock) {
            setModalMessage("Stock insuficiente.");
            setMessageModalIsOpen(true);
            return;
        }

        setCarrito((prevCarrito) => {
            const existente = prevCarrito.find(p => p.codigo_producto === producto.codigo_producto);
            if (existente) {
                const nuevaCantidad = existente.cantidad + cantidadSeleccionada;
                if (nuevaCantidad > producto.stock) {
                    setModalMessage("La cantidad total en el carrito excede el stock disponible.");
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
                setModalMessage("Venta finalizada exitosamente");
                setMessageModalIsOpen(true);
                setCarrito([]);
                setPaginaActual('VentasPendientes');
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
        <div className="main-block">
            {paginaActual === 'insertCabecera' && (
                <>
                    <form onSubmit={handleSubmit}>
                        <h1>Cabecera Venta</h1>
                        <fieldset>
                            <h3>Detalles del Cliente</h3>
                            <div className="account-details" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                <div>
                                    <label>Nombre*</label>
                                    <input
                                        type="text"
                                        name="input-nombreC"
                                        maxLength="50"
                                        pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$"
                                        value={nombreC}
                                        required
                                        onChange={(e) => setNombreC(e.target.value)}
                                    />
                                </div>
                                <div className='telefono-wrapper'>
                                    <label>Teléfono*</label>
                                    <span className='cod-area'>+56</span>
                                    <input
                                        type="text"
                                        name="input-teléfono"
                                        minLength="9"
                                        maxLength="9"
                                        pattern="[0-9]+"
                                        placeholder='No considere el +56'
                                        value={telefono}
                                        required
                                        onChange={(e) => setTelefono(e.target.value)}
                                    />
                                </div>
                            </div>
                        </fieldset>
                        <br></br>
                        <fieldset>
                            <h3>Dirección de despacho</h3>
                            <div className="account-details" style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>
                                    <label>Región*</label>
                                    <select value={region} required onChange={handleRegionChange}>
                                        <option value="">Selecciona una región</option>
                                        {Object.keys(optionSets).map((regionName) => (
                                            <option key={regionName} value={regionName}>{regionName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label>Comuna*</label>
                                    <select
                                        value={ciudad}
                                        required
                                        onChange={(e) => setCiudad(e.target.value)}
                                        disabled={!region}
                                    >
                                        <option value="">Selecciona una comuna</option>
                                        {region && optionSets[region].map((city) => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label>Calle*</label>
                                    <input
                                        type="text"
                                        name="input-calle"
                                        maxLength="100"
                                        required
                                        value={calle}
                                        onChange={(e) => setCalle(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label>Número*</label>
                                    <input
                                        type="text"
                                        name="input-numero"
                                        maxLength="4"
                                        pattern="[0-9]+"
                                        required
                                        value={numero}
                                        onChange={(e) => setNumero(e.target.value)}
                                    />
                                </div>
                            </div>
                        </fieldset>
                        <button type="submit">Añadir cliente</button>
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
                                        maxLength="15"
                                        pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$"
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

                    <Modal isOpen={messageModalIsOpen} onRequestClose={closeModal} ariaHideApp={false} className={"custom-modal"}>
                        <h2>Mensaje</h2>
                        <p>{modalMessage}</p>
                        <button onClick={closeModal}>Cerrar</button>
                    </Modal>
                </>
            )}
            {paginaActual === 'VentasPendientes' && (
                <>
                    <VentasPendientes />
                </>
            )}
        </div>
    );
}
export default VentaClienteNu;