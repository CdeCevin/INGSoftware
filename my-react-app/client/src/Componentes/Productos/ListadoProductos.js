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
            document.title = 'Listado Productos';
        }, []);

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
                    // Convertir array de arrays a array de objetos
                    const productosFormateados = data.map((producto) => ({
                        Codigo_Producto: producto[0],
                        Activo: producto[1],
                        Stock: producto[2],
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
                <table className="venta-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
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
                        
                        <tr key={producto.Codigo_Producto}>
                            <td>{producto.Fecha}</td>
                            <td>{producto.Codigo_Producto}</td>
                            <td>{producto.Stock}</td>
                            <td>{producto.Stock_Minimo}</td>
                            <td>{producto.Precio_Unitario}</td>
                            <td>{producto.Nombre_Producto}</td>
                            <td>{producto.Color_Producto}</td>
                         </tr>
                    ))}
                    </tbody>
                    </table>
            </div>
        );
    };

    export default ListadoProductos;

