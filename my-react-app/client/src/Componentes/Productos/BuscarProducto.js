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
    const [modalMessage, setModalMessage] = useState('');

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
            if (data.data && data.data.length <= 0) {
                setModalMessage('No se encontraron productos.');
            } 
        } catch (error) {
            console.error('Error al buscar productos:', error);
            setModalMessage('Error al buscar productos.');
        } finally {
            setModalIsOpen(true); // Abre el modal después de buscar
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div style={{ marginLeft: '12%' }}>
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

                {/* Modal para mostrar mensajes */}
                <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Mensaje">
                    <h2>Mensaje</h2>
                    <p>{modalMessage}</p>
                    <button onClick={closeModal}>Cerrar</button>
                </Modal>

                {productos.length > 0 ? (
                    <table className="venta-table">
                        <thead>
                            <tr>
                                <th>CÓDIGO</th>
                                <th>STOCK</th>
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
                                    <td>{producto.precio_unitario}</td>
                                    <td>{producto.nombre_producto}</td>
                                    <td>{producto.color_producto}</td>
                                    <td>
                                        <form action="pagina_foto_producto.php" method="get">
                                            <input type="hidden" name="id" value={producto.codigo_producto} />
                                            <button type="submit">
                                                <i className="fa fa-eye"></i>
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p></p> //ASDFAF NO SE COMO SACAR ESTO
                )}
            </div>
        </div>
    );
};

export default BuscarProducto;
