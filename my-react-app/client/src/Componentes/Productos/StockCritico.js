import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import Modal from 'react-modal';
import authenticatedFetch from '../../utils/api';

Modal.setAppElement('#root');

function StockCritico() {
    const [productosBajoStock, setProductosBajoStock] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [modalMessage, setModalMessage] = useState(''); 
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        document.title = 'Stock Crítico';
        const allowedRoles = ['Administrador', 'Vendedor'];

        if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
            navigate('/login');
        }
    }, [userRole, navigate]);

    // Función para obtener productos con stock crítico
    const obtenerProductosBajoStock = async () => {
        try {
            const response = await authenticatedFetch('/stockCritico');

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userRut');
                navigate('/login');
                return;
            }

            if (!response.ok) {
                throw new Error('Error en la red al obtener los productos de stock crítico');
            }
            const data = await response.json();
            const productosFormateados = data.map((producto) => ({
                Codigo_Producto: producto[0],
                Stock_Minimo: producto[6],
                Stock: producto[3],
                Precio_Unitario: producto[4],
                Nombre_Producto: producto[2],
                Categoria: producto[1],
                Color_Producto: producto[5],
            }));
            setProductosBajoStock(productosFormateados);
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    };

   const mostrarImagen = (Codigo_Producto) => {
        // Se cambió para forzar la extensión a .jpg, ya que el backend la guarda así.
        const imageUrl = `/images/Outlet/${Codigo_Producto}.jpg`; 
        console.log('En front, URL de la imagen:', imageUrl);
        setSelectedImage(imageUrl);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedImage(null);
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            obtenerProductosBajoStock();
        }
    }, [navigate]);

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
            <h1>Stock Crítico</h1>
            <fieldset>
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
                    <button onClick={closeModal} className="close-buttonImagen">&times;</button>
                </Modal>
                {productosBajoStock.length > 0 ? (
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
                            {productosBajoStock.map((producto) => (
                                <tr key={producto.Codigo_Producto}>
                                    <td>{producto.Codigo_Producto}</td>
                                    <td>{producto.Stock}</td>
                                    <td>{producto.Stock_Minimo}</td>
                                    <td>${producto.Precio_Unitario}</td>
                                    <td>{producto.Nombre_Producto}</td>
                                    <td>{producto.Color_Producto}</td>
                                    <td>
                                        <button type="button" onClick={() => mostrarImagen(producto.Codigo_Producto)} className="btn btn-primary">
                                            <i className="fa fa-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                ) : (
                    <p>No hay productos con stock crítico.</p>
                )}
            </fieldset>
        </div>
    );
}

export default StockCritico;