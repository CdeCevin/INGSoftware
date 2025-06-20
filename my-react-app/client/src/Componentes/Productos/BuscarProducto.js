import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import Modal from 'react-modal';
import authenticatedFetch from '../../utils/api';

Modal.setAppElement('#root');

const BuscarProducto = () => {
    const [nombre, setNombre] = useState('');
    const [color, setColor] = useState('');
    const [productos, setProductos] = useState([]);
    const [imageModalIsOpen, setImageModalIsOpen] = useState(false);
    const [messageModalIsOpen, setMessageModalIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [modalMessage, setModalMessage] = useState("");
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        document.title = 'Buscar Producto';
        const allowedRoles = ['Administrador', 'Vendedor'];

        if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
            navigate('/login');
        }
    }, [userRole, navigate]);

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
                setModalMessage(errorData.message || 'Error al buscar producto.');
                setMessageModalIsOpen(true);
                setProductos([]);
                return;
            }

            const data = await response.json();

            if (data.data && data.data.length > 0) {
                setProductos(data.data);
                setModalMessage('');
            } else {
                setProductos([]);
                setModalMessage('No se encontraron productos con los criterios de búsqueda.');
                setMessageModalIsOpen(true);
            }
        } catch (error) {
            setProductos([]);
            setModalMessage('Error al buscar productos. Inténtalo de nuevo.');
            setMessageModalIsOpen(true);
        }
    };

    const mostrarImagen = (codigo_producto) => {
        const imageUrl = `/images/Outlet/${codigo_producto}.jpg`;
        setSelectedImage(imageUrl);
        setImageModalIsOpen(true);
    };

    const closeModal = () => {
        setImageModalIsOpen(false);
        setMessageModalIsOpen(false);
        setSelectedImage(null);
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
            <form onSubmit={buscarProductos} encType="multipart/form-data">
                <h1>Buscar Producto</h1>
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
                <button type="submit">Buscar</button>
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
                <button onClick={closeModal}>Cerrar</button>
            </Modal>

            {productos.length > 0 && (
                <fieldset>
                    <h3>Resultados</h3>
                    <table className="venta-table">
                        <thead>
                            <tr>
                                <th>CÓDIGO</th>
                                <th>STOCK</th>
                                <th>STOCK MÍNIMO</th>
                                <th>PRECIO</th>
                                <th>NOMBRE</th>
                                <th>COLOR</th>
                                <th>FOTO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((producto) => (
                                <tr key={producto.codigo_producto}>
                                    <td>{producto.codigo_producto}</td>
                                    <td>{producto.stock}</td>
                                    <td>{producto.stock_minimo}</td>
                                    <td>{producto.precio_unitario}</td>
                                    <td>{producto.nombre_producto}</td>
                                    <td>{producto.color_producto}</td>
                                    <td>
                                        <button type="button" onClick={() => mostrarImagen(producto.codigo_producto)} className={"btn btn-primary"}>
                                            <i className="fa fa-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </fieldset>
            )}

            <Modal isOpen={messageModalIsOpen} onRequestClose={closeModal} ariaHideApp={false} className={"custom-modal"}>
                <h2>Mensaje</h2>
                <p>{modalMessage}</p>
                <button onClick={closeModal}>Cerrar</button>
            </Modal>
        </div>
    );
};

export default BuscarProducto;