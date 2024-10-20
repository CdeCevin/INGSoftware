import React, { useState, useEffect } from 'react';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Reemplaza '#root' con tu selector de raíz

function BuscarProducto() {
    const [nombre, setNombre] = useState('');
    const [color, setColor] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false); // Estado para abrir/cerrar el modal
    const [modalMessage, setModalMessage] = useState(''); // Mensaje para el modal

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Enviar los datos al backend
            const response = await fetch('http://localhost:3001/api/buscarProducto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'input-nombre': nombre, 'input-color': color }), // Envía los datos como JSON
            });

            if (response.ok) {
                const data = await response.json();
                setModalMessage(data.message); // Mostrar mensaje de éxito
                // Reiniciar el formulario
                resetForm();
            } else {
                const errorData = await response.json();
                setModalMessage(errorData.message); // Mostrar mensaje de error
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            setModalMessage('Error al enviar el formulario.'); // Mensaje de error genérico
        } finally {
            setModalIsOpen(true); // Abrir el modal después de intentar enviar el formulario
        }
    };

    const resetForm = () => {
        setNombre('');
        setColor('');
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    useEffect(() => {
        document.title = 'Buscar Producto';
    }, []);

    return (
        <div style={{ marginLeft: '12%' }}>
            <div className="main-block">
                <form onSubmit={handleSubmit}>
                    <h1>Buscar Producto</h1>
                    <fieldset>
                        <legend>
                            <h3>Detalles del Producto</h3>
                        </legend>
                        <div className="account-details" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div>
                                <label>Nombre*</label>
                                <input 
                                    type="text" 
                                    name="input-nombre" 
                                    maxLength="50" 
                                    required 
                                    value={nombre} 
                                    onChange={(e) => setNombre(e.target.value)} 
                                />
                            </div>
                            <div>
                                <label>Color Producto*</label>
                                <input 
                                    type="text" 
                                    name="input-color" 
                                    value={color} 
                                    onChange={(e) => setColor(e.target.value)} 
                                />
                            </div>
                        </div>
                    </fieldset>
                    <button type="submit">Buscar</button>
                </form>
            </div>

            {/* Modal para mostrar mensajes */}
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Mensaje">
                <h2>Mensaje</h2>
                <p>{modalMessage}</p>
                <button onClick={closeModal}>Cerrar</button>
            </Modal>
        </div>
    );
}

export default BuscarProducto;
