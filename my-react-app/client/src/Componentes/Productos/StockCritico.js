import React, { useEffect, useState } from 'react';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import Modal from 'react-modal';



function StockCritico()  {
    const [productosBajoStock, setProductosBajoStock] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [modalMessage, setModalMessage] = useState('');

    // Función para obtener productos con stock crítico
    const obtenerProductosBajoStock = async(event) => {

        try {
            const response = await fetch('http://localhost:3001/api/stockCritico');
            const data = await response.json();
            const productosFormateados = data.map((producto) => ({
                Codigo_Producto: producto[0],
                Stock_Minimo: producto[6],
                Stock: producto[3],
                Precio_Unitario: producto[4],
                Nombre_Producto: producto[2],
                Categoria: producto[1],
                Color_Producto: producto[5],
            }));
            setProductosBajoStock(productosFormateados);        
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

    useEffect(() => {
        document.title = 'Stock Crítico';
    }, []);

    return (

        
            
        <div style={{ marginLeft: '13%' }}>
            <div className="main-block">
            <h1 style={{padding:20}}>Stock Crítico</h1>
            <fieldset style={{paddingTop:0}}>
            <legend>
                <h3>Stock</h3>
            </legend>
                {productosBajoStock.length > 0 ? (
                    <table className="venta-table" style={{ marginLeft: '8%' }}>
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
                    {productosBajoStock.map((producto) => (
                        
                        <tr key={producto.Codigo_Producto}>
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
                    
                ) : (
                    <p>No hay productos con stock crítico.</p>
                )}
                </fieldset>
        </div>

        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} ariaHideApp={false}> 
                <h2>Mensaje</h2>
                <p>{modalMessage}</p>
                <button onClick={closeModal}>Cerrar</button>
            </Modal>
        </div>
    );
}

export default StockCritico;
