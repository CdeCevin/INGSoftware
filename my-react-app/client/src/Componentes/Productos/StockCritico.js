import React, { useEffect, useState } from 'react';

function StockCritico() {
    const [productosBajoStock, setProductosBajoStock] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    // Función para obtener productos con stock crítico
    const obtenerProductosBajoStock = async(event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/stockCritico');
            const data = await response.json();
            if (data.data && data.data.length > 0) {
                setProductosBajoStock(data); // Si hay productos, actualiza el estado pero NO abre el modal
            } else {
                setSelectedImage(null); // Asegurarse de que no haya imagen seleccionada
                setModalIsOpen(true); // Abre el modal si no se encuentran productos
            }
            
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }

    };

    const mostrarImagen = (codigo_producto) => {
        const imageUrl = `/images/Outlet/${codigo_producto}.jpg`; // Usamos una ruta relativa
        setSelectedImage(imageUrl); // Establecer la URL de la imagen seleccionada
        setModalIsOpen(true); // Abrir el modal con la imagen
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };



    useEffect(() => {
        obtenerProductosBajoStock(); // Llamar a la función al montar el componente
    }, []);

    return (

        <div style={{ marginLeft: '13%' }}>
            <div className="main-block">
            <h1>Productos con Stock Crítico</h1>
                {productosBajoStock.length > 0 ? (
                    <table className="venta-table">
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
                    {productosBajoStock.map((producto, index) => (
                        <tr key={index}>
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
                    <p>No hay productos con stock crítico.</p>
                )}
        </div>
        </div>
    );
}

export default StockCritico;
