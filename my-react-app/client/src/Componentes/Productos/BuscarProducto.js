import React, { useState } from 'react';

const BuscarProducto = () => {
    const [nombre, setNombre] = useState('');
    const [color, setColor] = useState('');
    const [productos, setProductos] = useState([]);

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
            setProductos(data.data); // Asumiendo que `data.data` contiene el array de productos
        } catch (error) {
            console.error('Error al buscar productos:', error);
        }
    };

    return (
        <div>
            <form onSubmit={buscarProductos}>
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre del producto"
                />
                <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="Color del producto"
                />
                <button type="submit">Buscar</button>
            </form>

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
                <p>No se encontraron productos.</p>
            )}
        </div>
    );
};

export default BuscarProducto;
