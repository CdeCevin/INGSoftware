import React, { useEffect, useState } from 'react';

const ListadoProductos = () => {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const obtenerProductos = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/products'); // Asegúrate de que esta URL sea correcta
                if (!response.ok) {
                    throw new Error('Error en la red al obtener los productos');
                }
                const data = await response.json();
                setProductos(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setCargando(false);
            }
        };

        obtenerProductos();
    }, []);

    if (cargando) {
        return <div>Cargando productos...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Listado de Productos</h2>
            <ul>
                {productos.map((producto) => (
                    <li key={producto.Codigo_Producto}>
                        <h3>{producto.Nombre_Producto}</h3>
                        <p>Precio: ${producto.Precio_Unitario}</p>
                        <p>Stock: {producto.Stock}</p>
                        <p>Color: {producto.Color_Producto}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListadoProductos;
