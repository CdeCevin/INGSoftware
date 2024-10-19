import React, { useEffect, useState } from 'react';

function StockCritico() {
    const [productosBajoStock, setProductosBajoStock] = useState([]);

    // Función para obtener productos con stock crítico
    const obtenerProductosBajoStock = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/stockCritico');
            const data = await response.json();
            setProductosBajoStock(data);
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    };

    useEffect(() => {
        obtenerProductosBajoStock(); // Llamar a la función al montar el componente
    }, []);

    return (
        <div>
            <h1>Productos con Stock Crítico</h1>
            <ul>
                {productosBajoStock.length > 0 ? (
                    productosBajoStock.map((producto, index) => (
                        <li key={index}>
                            <strong>Producto:</strong> {producto[2]} <br />
                            <strong>Código:</strong> {producto[0]} <br />
                            <strong>Stock Actual:</strong> {producto[3]} <br />
                            <strong>Stock Mínimo:</strong> {producto[7]} <br />
                            <strong>Precio Unitario:</strong> ${producto[4]} <br />
                            <strong>Color:</strong> {producto[5]} <br />
                            <hr />
                        </li>
                    ))
                ) : (
                    <p>No hay productos con stock crítico.</p>
                )}
            </ul>
        </div>
    );
}

export default StockCritico;
