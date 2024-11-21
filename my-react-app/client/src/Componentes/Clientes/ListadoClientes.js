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
            <h1>Registro Clientes</h1>
            <br />
            <table className="venta-table" style={{marginLeft:'8%'}}>
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
                            <tr key={cliente[0]}> {/* Usa cliente[0] para el código */}
                                <td className="venta-cell">{cliente[0]}</td> {/* Código */}
                                <td className="venta-cell">{cliente[1]}</td> {/* Teléfono */}
                                <td className="venta-cell">{cliente[2]}</td> {/* Nombre */}
                                <td className="venta-cell">{cliente[3]}</td> {/* Código Dirección */}
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
