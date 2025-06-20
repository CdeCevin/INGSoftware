import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import Modal from 'react-modal';
import authenticatedFetch from '../../utils/api';

Modal.setAppElement('#root');

const ListadoProductos = () => {
    const [productos, setProductos] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [modalMessage, setModalMessage] = useState('');
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        document.title = 'Listado Productos';
        const allowedRoles = ['Administrador', 'Vendedor'];

        if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
            navigate('/login');
        }
    }, [userRole, navigate]);

    useEffect(() => {
        const obtenerProductos = async () => {
            setCargando(true);
            try {
                const response = await authenticatedFetch('/products');

                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userRole');
                    localStorage.removeItem('userRut');
                    navigate('/login');
                    return;
                }

                if (!response.ok) {
                    throw new Error('Error en la red al obtener los productos');
                }
                const data = await response.json();

                const productosFormateados = data.map((producto) => ({
                    Codigo_Producto: producto[0],
                    Stock: producto[1],
                    Stock_Minimo: producto[2],
                    Precio_Unitario: producto[3],
                    Nombre_Producto: producto[4],
                    Categoria: producto[5],
                    Color_Producto: producto[6],
                    Fecha: producto[7],       
                }));
                setProductos(productosFormateados);
            } catch (error) {
                setError(error.message);
            } finally {
                setCargando(false);
            }
        };

        if (localStorage.getItem('token')) {
            obtenerProductos();
        }
    }, [navigate]);

    if (cargando) {
        return (
            <div className="main-block">
                <h1>Cargando productos...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div className="main-block">
                <h1>Error: {error}</h1>
            </div>
        );
    }

    const mostrarImagen = (producto) => {
        const imageUrl = `/images/Outlet/${producto.Codigo_Producto}.jpg`; 
        setSelectedImage(imageUrl);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
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
            <h1>Listado de Productos</h1>
            <fieldset>
                <h3>Productos añadidos</h3>
                <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Imagen del Producto" className={"custom-modal"}>
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
                <table className="venta-table">
                    <thead>
                        <tr>
                            <th>FECHA</th>
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
                            <tr key={producto.Codigo_Producto}>
                                <td>{producto.Fecha ? new Date(producto.Fecha).toLocaleDateString() : 'Sin fecha'}</td>
                                <td>{producto.Codigo_Producto}</td>
                                <td>{producto.Stock}</td>
                                <td>{producto.Stock_Minimo}</td>
                                <td>${producto.Precio_Unitario}</td>
                                <td>{producto.Nombre_Producto}</td>
                                <td>{producto.Color_Producto}</td>
                                <td>
                                    {/* Se cambió para pasar el objeto 'producto' completo a la función 'mostrarImagen' */}
                                    <button type="button" onClick={() => mostrarImagen(producto)} className={"btn mini-boton"}>
                                        <i className="fa fa-eye"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </fieldset>
        </div>
    );
};

export default ListadoProductos;