// my-react-app/client/src/Componentes/Pendientes/ListadoPendientes.js
import React, { useEffect, useState } from 'react';

/*
const [x, setx]: Desestructuración de un array. x es la variable de estado que contiene el valor actual, y setx es la función que se usa para actualizar ese valor.
useState([]): useState es un hook de React que permite añadir estado a un componente funcional. El argumento [] es el valor inicial del estado.
*/ 


const ListadoPendientes = () => {
    const [pendientes, setPendientes] = useState([]);
    const [visibleTables, setVisibleTables] = useState({});

   
    const handleButtonClick = (idVenta) => {
        setVisibleTables((prevState) => ({
          ...prevState,
          [idVenta]: !prevState[idVenta],
        }));
         /*
        prevState: Estado actual de visibleTables antes de la actualización.
        { ...prevState }: Copia todas las propiedades del estado anterior al nuevo estado.
        [idVenta]: !prevState[idVenta]: Actualiza el valor de la propiedad correspondiente a idVenta.
        */
      };
    
    useEffect(() => {
        const fetchPendientes = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/pendientes');
                if (!response.ok) {
                    throw new Error('Error en la respuesta de la API');
                }
                const data = await response.json();
                console.log('Datos obtenidos de la API:', data); // Verifica los datos
                setPendientes(data);
            } catch (error) {
                console.error('Error al obtener la lista de pendientes:', error);
            }
        };

        fetchPendientes();
    }, []);

    useEffect(() => {
        document.title = 'Pendientes';
    }, []);

    return (
        <div style={{ marginLeft: '13%' }}>
            <div className="main-block">
                <br />
                <h1>Ventas Pendientes</h1>
                <br />
                {pendientes.length > 0 ? (
                pendientes.map((venta) => (
                    <div key={venta.idVenta} className="venta-block">
                    <table className="venta-table">
                        <thead>
                        <tr>
                            <th>Código Venta</th>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Dirección</th>
                            <th>Productos</th>
                            <th>Total</th>
                            <th>Realizado</th>
                            <th>Cancelar</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="venta-cell">{venta.idVenta}</td>
                            <td className="venta-cell">{new Date(venta.fecha).toLocaleDateString()}</td>
                            <td className="venta-cell">{venta.cliente}</td>
                            <td className="venta-cell">{venta.direccion}</td>
                            <td className="venta-cell">
                            <button className='btn_Pendientes' onClick={() => handleButtonClick(venta.idVenta)}>Ver Productos</button> {/*Hace que la visualizacion de la tabla sea V o F dependiendo de su estado anterior */}
                            {/* Solo si visibleTables es V se renderiza la tabla de sus productos*/}
                            {visibleTables[venta.idVenta] && (
                            <table style={{borderCollapse: 'collapse'}}>
                                <tbody>
                                {venta.productos && venta.productos.length > 0 ? (
                                    venta.productos.map((producto, index) => (
                                    <tr key={index}>
                                        <td style={{border: 'none'}}> - {producto.nombre},{producto.cantidad},{producto.color}</td>
                                    </tr>
                                    ))
                                ) : (
                                    <tr>
                                    <td colSpan="3" style={{border: 'none'}}>No hay productos disponibles</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>)}
                            </td>
                            <td className="venta-cell">${venta.precioTotal}</td>
                            <td className="venta-cell">
                            <a href={`Realizado.php?id=${venta.idVenta}`} className="btn">
                                <i className="fa fa-check" aria-hidden="true"></i>
                            </a>
                            </td>
                            <td className="venta-cell">
                            <a href={`Cancelar.php?id=${venta.idVenta}`} className="btn">
                                <i className="fa fa-times" aria-hidden="true"></i>
                            </a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                ))
                ) : (
                <p>No hay ventas pendientes.</p>
                )}
            </div>
            


            </div>
            

    );
};

export default ListadoPendientes;
