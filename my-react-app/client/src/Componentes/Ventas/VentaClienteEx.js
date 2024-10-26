import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Reemplaza '#root' con el ID de tu selector raíz si es diferente

const BuscarProducto = () => {
    const [nombre, setNombre] = useState('');
    const [color, setColor] = useState('');
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]); // Estado para manejar el carrito
    const [modalIsOpen, setModalIsOpen] = useState(false);

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

            if (!response.ok) throw new Error('Error en la solicitud');
            const data = await response.json();
            setProductos(data.data);
        } catch (error) {
            console.error('Error al buscar productos:', error);
            setModalIsOpen(true); // Abre el modal en caso de error
        }
    };

    const añadirAlCarrito = (producto, cantidad) => {
        setCarrito((prevCarrito) => [
            ...prevCarrito,
            { ...producto, cantidad }
        ]);
    };

    const terminarVenta = () => {
        // Aquí puedes enviar el carrito al backend o hacer el procesamiento final
        console.log('Productos en el carrito:', carrito);
        alert('Venta terminada');
    };

    return (
        <div style={{ marginLeft: '12%' }}>
            <div className="main-block">
                <form onSubmit={buscarProductos}>
                    <h1>Buscar Producto</h1>
                    <fieldset>
                        <legend>
                            <h3>Detalles del Producto</h3>
                        </legend>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label>Nombre*</label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Nombre del producto"
                                required
                            />
                            <label>Color</label>
                            <input
                                type="text"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                placeholder="Color del producto"
                            />
                        </div>
                    </fieldset>
                    <button type="submit">Buscar</button>
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
                                            max={producto.stock}
                                            onChange={(e) => producto.cantidad = e.target.value}
                                        />
                                    </td>
                                    <td>
                                        <button type="button" onClick={() => añadirAlCarrito(producto, producto.cantidad || 1)}>
                                            <i className="fa fa-shopping-cart"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <button onClick={terminarVenta}>Terminar Venta</button>
            </div>

            <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} contentLabel="Mensaje">
                <h2>Error</h2>
                <p>Ha ocurrido un error al buscar los productos.</p>
                <button onClick={() => setModalIsOpen(false)}>Cerrar</button>
            </Modal>
        </div>
    );
};

export default BuscarProducto;
