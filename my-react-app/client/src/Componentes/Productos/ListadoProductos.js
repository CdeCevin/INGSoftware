import React, { useEffect, useState } from 'react';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import Modal from 'react-modal';

const ListadoProductos = () => {
    console.log("HOLAA");
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const obtenerProductos = async () => {
            setCargando(true);
            console.log("Iniciando la obtención de productos");
            try {
                const response = await fetch('http://localhost:3001/api/products');
                console.log("Respuesta de la API:", response);
                if (!response.ok) {
                    throw new Error('Error en la red al obtener los productos');
                }
                const data = await response.json();
                console.log("Datos recibidos:", data);

                // Extraer productos de las ventas
                const productosFormateados = data.flatMap(venta => 
                    venta.productos.map((producto) => ({
                        Codigo_Producto: producto.codigo, // Ajusta estos nombres de acuerdo a tu API
                        Activo: producto.activo,
                        Stock: producto.stock,
                        Precio_Unitario: producto.precioUnitario,
                        Nombre_Producto: producto.nombre,
                        Categoria: producto.categoria,
                        Color_Producto: producto.color,
                    }))
                );

                setProductos(productosFormateados);
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
