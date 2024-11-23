import React, { useState, useEffect } from 'react';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Reemplaza '#root' con tu selector de raíz

function EliminarProducto() {
    
    const [codigo, setCodigo] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false); // Estado para abrir/cerrar el modal
    const [modalMessage, setModalMessage] = useState(''); // Mensaje para el modal

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log("Valor de código antes de enviar:", codigo); // Verifica si el valor se está capturando correctamente
        
        try {
            // Enviar los datos al backend como JSON
            const response = await fetch('http://localhost:3001/api/eliminarProducto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Asegúrate de enviar JSON
                },
                body: JSON.stringify({ codigo }) // Enviar el código del producto como JSON
            });
            
            console.log("Código enviado al backend:", codigo); // Verifica qué valor estás enviando al backend
        
            if (response.ok) {
                const data = await response.json();
                console.log("Respuesta exitosa del backend:", data); // Verifica la respuesta del backend
                setModalMessage(data.message); // Mostrar mensaje de éxito
                resetForm();
            } else {
                const errorData = await response.json();
                console.error("Error al eliminar el producto:", errorData); // Muestra detalles del error
                setModalMessage(errorData.message); // Mostrar mensaje de error
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            setModalMessage('Error al enviar el formulario.');
        } finally {
            setModalIsOpen(true); // Abrir el modal después de intentar enviar el formulario
        }
    };
    
    

    const resetForm = () => {
        setCodigo('');
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    useEffect(() => {
        document.title = 'Eliminar Producto';
    }, []);

    return (
        <div style={{ marginLeft: '12%' }}>
            <div className="main-block">
                <form onSubmit={handleSubmit}>
                    <h1>Eliminar Producto</h1>
                    <fieldset>
                        <legend>
                            <h3>Eliminar</h3>
                        </legend>
                        <div className="account-details" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div>
                                <label>Código Producto*</label>
                                <input 
                                    type="text" 
                                    name="codigo" 
                                    pattern="[0-9]+" 
                                    maxLength="4" 
                                    required 
                                    value={codigo} 
                                    onChange={(e) => setCodigo(e.target.value)} 
                                />
                            </div>
                        </div>
                    </fieldset>
                    <button type="submit">Eliminar</button>
                </form>
            </div>
            {/* Modal para mostrar mensajes */}
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Mensaje" className={"custom-modal"}>
                <h2>Mensaje</h2>
                <p>{modalMessage}</p>
                <button onClick={closeModal}>Cerrar</button>
            </Modal>
        </div>
    );
}

export default EliminarProducto;
