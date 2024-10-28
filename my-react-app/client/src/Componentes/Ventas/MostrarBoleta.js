import React, { useEffect, useState } from 'react';

const MostrarBoleta = () => {
    const [boleta, setBoleta] = useState(null);

    useEffect(() => {
        const fetchBoleta = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/boleta');
                if (response.ok) {
                    const data = await response.json();
                    setBoleta(data);
                } else {
                    console.error('Error al obtener la boleta:', response.statusText);
                }
            } catch (error) {
                console.error('Error al hacer la solicitud:', error);
            }
        };

        fetchBoleta();
    }, []);

    return (
        <div>
            <h1>Boleta</h1>
            {boleta ? (
                <div>
                    <h2>Detalles de la Boleta</h2>
                    <p>ID de la boleta: {boleta.id}</p>
                    <h3>Productos</h3>
                    <ul>
                        {boleta.productos.map((producto, index) => (
                            <li key={index}>{producto.nombre} - Cantidad: {producto.cantidad} - Precio: {producto.precio}</li>
                        ))}
                    </ul>
                    <p>Total: ${boleta.total}</p>
                </div>
            ) : (
                <p>Cargando...</p>
            )}
        </div>
    );
};

export default MostrarBoleta;
