// my-react-app/client/src/Componentes/Pendientes/ListadoPendientes.js
import React, { useEffect, useState } from 'react';
//import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import Modal from 'react-modal';
Modal.setAppElement('#root'); // Reemplaza '#root' con tu selector de raíz

const ListadoPendientes = () => {
    const [pendientes, setPendientes] = useState([]);
    const [visibleTables, setVisibleTables] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [buttonText, setButtonText] = useState("Ver Productos");

    const handleButtonClick = (idVenta) => {
        setVisibleTables((prevState) => ({
            ...prevState,
            [idVenta]: !prevState[idVenta],
        }));
        setButtonText((prevState) => prevState === "Ver Productos" ? "Cerrar Productos" : "Ver Productos");
    };

    const refreshPage = () => {
        // Guardar el estado en localStorage antes de refrescar
        localStorage.setItem('visibleTables', JSON.stringify(visibleTables));
        window.location.reload();
    };

    const realizarVenta = async (idVenta) => {
        console.log("Valor de código antes de enviar:", idVenta);
    
        try {
            const response = await fetch('http://localhost:3001/api/ventasPendientes/realizar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idVenta })
            });
    
            console.log("Código enviado al backend:", idVenta);
    
            if (response.ok) {
                const data = await response.json();
                console.log("Respuesta exitosa del backend:", data);
                setModalMessage(data.message); // Mostrar mensaje de éxito
    
                // Filtrar la venta realizada del estado
                setPendientes((prevPendientes) => prevPendientes.filter(venta => venta.idVenta !== idVenta));
            } else {
                const errorData = await response.json();
                console.error("Error al realizar la venta:", errorData);
                setModalMessage(errorData.message); // Mostrar mensaje de error
            }    
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            setModalMessage('Error al enviar el formulario.');
        } finally {
            setModalIsOpen(true);
        }
    };
    
    const cancelarVenta = async (idVenta) => {
        console.log("Valor de código antes de enviar:", idVenta);
    
        try {
            const response = await fetch('http://localhost:3001/api/ventasPendientes/cancelar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idVenta })
            });
    
            console.log("Código enviado al backend:", idVenta);
    
            if (response.ok) {
                const data = await response.json();
                console.log("Respuesta exitosa del backend:", data);
                setModalMessage(data.message); // Mostrar mensaje de éxito
    
                // Filtrar la venta cancelada del estado
                setPendientes((prevPendientes) => prevPendientes.filter(venta => venta.idVenta !== idVenta));
            } else {
                const errorData = await response.json();
                console.error("Error al cancelar la venta:", errorData);
                setModalMessage(errorData.message); // Mostrar mensaje de error
            }    
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            setModalMessage('Error al enviar el formulario.');
        } finally {
            setModalIsOpen(true);
        }
    };
    

    useEffect(() => {
        const fetchPendientes = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/ventasPendientes');
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
        // Recuperar el estado de localStorage
        const storedVisibleTables = localStorage.getItem('visibleTables');
        if (storedVisibleTables) {
            setVisibleTables(JSON.parse(storedVisibleTables));
        }
    }, []);

    const closeModal = () => {
        setModalIsOpen(false);
    };

    useEffect(() => {
        document.title = 'Pendientes';
    }, []);

    return (
            <div className="main-block">
                <h1>Ventas Pendientes</h1>
                {pendientes.length > 0 ? (
                    pendientes.map((venta) => (
                        <div key={venta.idVenta} className="venta-block">
                            <table className="venta-table">
                                <thead>
                                    <tr>
                                        <th>CÓDIGO DE VENTA</th>
                                        <th>FECHA</th>
                                        <th>CLIENTE</th>
                                        <th>DIRECCIÓN</th>
                                        <th>PRODUCTOS</th>
                                        <th>TOTAL</th>
                                        <th>COMPLETAR</th>
                                        <th>ANULAR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="venta-cell">{venta.idVenta}</td>
                                        <td className="venta-cell">{new Date(venta.fecha).toLocaleDateString()}</td>
                                        <td className="venta-cell">{venta.cliente}</td>
                                        <td className="venta-cell">{venta.direccion}</td>
                                        <td className="venta-cell">
                                        <button className='btn_Pendientes' onClick={() => handleButtonClick(venta.idVenta)}> {visibleTables[venta.idVenta] ? "Cerrar Productos" : "Ver Productos"} </button>
                                            {visibleTables[venta.idVenta] && (
                                                <table style={{ borderCollapse: 'collapse' }}>
                                                    <tbody>
                                                        {venta.productos && venta.productos.length > 0 ? (
                                                            venta.productos.map((producto, index) => (
                                                                <tr key={index}>
                                                                    <td style={{ border: 'none' }}> - {producto.nombre}, {producto.cantidad}, {producto.color}</td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="3" style={{ border: 'none' }}>No hay productos disponibles</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            )}
                                        </td>
                                        <td className="venta-cell">${venta.precioTotal}</td>
                                        <td className="venta-cell">
                                            <button className="btn complete-btn" onClick={() => realizarVenta(venta.idVenta)}>
                                                <i className="fa fa-check" aria-hidden="true"></i>
                                            </button>
                                        </td>
                                        <td className="venta-cell">
                                            <button className="btn cancel-btn" onClick={() => cancelarVenta(venta.idVenta)}>
                                                <i className="fa fa-times" aria-hidden="true"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ))
                ) : (
                    <p>No hay ventas pendientes.</p>
                )}
            

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className={"custom-modal"}>
                <h2>Mensaje</h2>
                <p>{modalMessage}</p>
                <button onClick={closeModal}>Cerrar</button>
            </Modal>
        </div>
    );
};

export default ListadoPendientes;
