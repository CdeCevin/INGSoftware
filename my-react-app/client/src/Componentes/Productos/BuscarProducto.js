import React, { useState,useEffect } from 'react';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Asegúrate de reemplazar '#root' con tu selector de raíz

const BuscarProducto = () => {
    const [nombre, setNombre] = useState('');
    const [color, setColor] = useState('');
    const [productos, setProductos] = useState([]);

    const [imageModalIsOpen, setImageModalIsOpen] = useState(false);
    const [messageModalIsOpen, setMessageModalIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);  // Aquí va la imagen seleccionada
    const [modalMessage, setModalMessage] = useState("");      


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
                setModalMessage('Error al buscar producto.');
                setMessageModalIsOpen(true);
            }
        } catch (error) {
            console.error('Error al buscar productos:', error);
            setMessageModalIsOpen(true); // Abre el modal si ocurre un error
        }
    };

    // Función para manejar la visualización de la imagen
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
        document.title = 'Buscar Producto';
    }, []);

    return (
        <div style={{ marginLeft: '13%' }}>
            <div className="main-block">
                <form onSubmit={buscarProductos} encType="multipart/form-data">
                    <h1>Buscar Producto</h1>
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
                    <button type="submit">Buscar</button>
                </form>

                {/* Modal para mostrar la imagen seleccionada */}
                <Modal isOpen={imageModalIsOpen} onRequestClose={closeModal} contentLabel="Imagen del Producto">
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

                {productos.length > 0 ? (
                    <fieldset>
                        <legend>
                            <h3>Resultados</h3>
                        </legend>
                    <table className="venta-table" style={{ marginLeft: '10%' }}>
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
                                        {/* Botón para ver la imagen */}
                                        <button type="button" onClick={() => mostrarImagen(producto.codigo_producto)}>
                                            <i className="fa fa-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </fieldset>
                ) : (
                    <p></p>
                )}
            </div>
            <Modal isOpen={messageModalIsOpen} onRequestClose={closeModal} ariaHideApp={false} className={"custom-modal"}>
                <h2>Mensaje</h2>
                <p>{modalMessage}</p>
                <button onClick={closeModal}>Cerrar</button>
            </Modal>
        </div>
    );
};

export default BuscarProducto;
