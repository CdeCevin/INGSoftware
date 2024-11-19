import React, { useState } from 'react';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Asegúrate de reemplazar '#root' con tu selector de raíz

const BuscarProducto = () => {
    const [nombre, setNombre] = useState('');
    const [color, setColor] = useState('');
    const [productos, setProductos] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null); // Estado para manejar la imagen seleccionada

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
                setSelectedImage(null); // Asegurarse de que no haya imagen seleccionada
                setModalIsOpen(true); // Abre el modal si no se encuentran productos
            }
        } catch (error) {
            console.error('Error al buscar productos:', error);
            setModalIsOpen(true); // Abre el modal si ocurre un error
        }
    };

    // Función para manejar la visualización de la imagen
    const mostrarImagen = (codigo_producto) => {
        const imageUrl = `/images/Outlet/${codigo_producto}.jpg`; // Usamos una ruta relativa
        setSelectedImage(imageUrl); // Establecer la URL de la imagen seleccionada
        setModalIsOpen(true); // Abrir el modal con la imagen
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div style={{ marginLeft: '13%' }}>
            <div className="main-block">
                <form onSubmit={buscarProductos} encType="multipart/form-data">
                    <h1>Buscar Producto</h1>
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
                    <button type="submit">Buscar</button>
                </form>

                {/* Modal para mostrar la imagen seleccionada */}
                <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Imagen del Producto">
                    <h2>Imagen del Producto</h2>
                    {selectedImage ? (
                        <img
                        src={selectedImage}
                        alt="Imagen del producto"
                        style={{
                          display: 'block',        // Hace que la imagen se comporte como un bloque para facilitar el centrado
                          margin: '0 auto',        // Centra la imagen horizontalmente
                          maxWidth: '80%',         // Limita el ancho máximo al 80% del contenedor (ajustable según necesidad)
                          height: 'auto',          // Mantiene la proporción de la imagen
                          maxHeight: '400px'       // Limita la altura máxima a 400px (puedes ajustarlo)
                        }}
                      />
                    ) : (
                        <p>No se ha seleccionado una imagen.</p>
                    )}
                    <button onClick={closeModal}>Cerrar</button>
                </Modal>

                {productos.length > 0 ? (
                    <table className="venta-table" style={{ marginLeft: '13%' }}>
                        <thead>
                            <tr>
                                <th>CÓDIGO</th>
                                <th>STOCK</th>
                                <th>STOCK MINIMO</th>
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
                                        {/* Botón para ver la imagen */}
                                        <button type="button" onClick={() => mostrarImagen(producto.codigo_producto)}>
                                            <i className="fa fa-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p></p>
                )}
            </div>
        </div>
    );
};

export default BuscarProducto;
