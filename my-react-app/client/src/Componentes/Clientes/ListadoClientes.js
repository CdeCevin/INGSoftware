import React, { useEffect, useState } from 'react';

const ListadoClientes = () => {
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/clientes'); // Cambiar a la URL correcta
                if (!response.ok) {
                    throw new Error('Error en la respuesta de la API');
                }
                const data = await response.json();
                setClientes(data);
            } catch (error) {
                console.error('Error al obtener la lista de clientes:', error);
            }
        };

        fetchClientes();
    }, []);

    useEffect(() => {
        document.title = 'Listado Clientes';
    }, []);

    return (
        <div style={{ marginLeft: '13%' }}>
            <div className="main-block">
                <h1 style={{ padding: 20 }}>Registro Clientes</h1>
                <table className="venta-table" style={{ marginLeft: '8%', paddingTop: 0 }}>
                    <thead>
                        <tr>
                            <th>CÓDIGO</th>
                            <th>TELÉFONO</th>
                            <th>NOMBRE</th>
                            <th>DIRECCIÓN</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.length > 0 ? (
                            clientes.map(cliente => (
                                <tr key={cliente.codigo}>
                                    <td className="venta-cell">{cliente.codigo}</td>
                                    <td className="venta-cell">{cliente.telefono}</td>
                                    <td className="venta-cell">{cliente.nombre}</td>
                                    <td className="venta-cell">{cliente.direccion}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center' }}>Cliente no encontrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListadoClientes;
