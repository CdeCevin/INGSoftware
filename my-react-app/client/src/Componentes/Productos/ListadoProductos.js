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
            

            obtenerProductos();
        }, []);

        if (cargando) {
            return <div>Cargando productos...</div>;
        }

        if (error) {
            return <div>Error: {error}</div>;
        }

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
                <h1>Productos con Stock Crítico</h1>
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
                        </tr>
                    </thead>
                    <tbody>
                    {productos.map((producto) => (
                        
                        <tr key={producto.Codigo_Producto}>
                            <td>{producto.Fecha.split('T')[0]}</td>
                            <td>{producto.Codigo_Producto}</td>
                            <td>{producto.Stock}</td>
                            <td>{producto.Stock_Minimo}</td>
                            <td>{producto.Precio_Unitario}</td>
                            <td>{producto.Nombre_Producto}</td>
                            <td>{producto.Color_Producto}</td>
                            <td>
                                {/* Botón para ver la imagen */}
                                <button type="button" onClick={() => mostrarImagen(producto.Codigo_Producto)}>
                                    <i className="fa fa-eye"></i>
                                </button>
                            </td>
                         </tr>
                    ))}
                    </tbody>
                    </table>
            </div>
            </div>
        );
    };

    export default ListadoProductos;

