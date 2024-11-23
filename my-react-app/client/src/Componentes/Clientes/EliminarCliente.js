import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

function EliminarCliente() {
    const [codigo, setCodigo] = useState('');
    const [clienteData, setClienteData] = useState(null);
    const [modalMessage, setModalMessage] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("El código es:", codigo);
            const response = await fetch(`http://localhost:3001/api/eliminarCliente`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ codigo }) // Enviar el código en el cuerpo
            });
    
            if (response.ok) {
                const data = await response.json();
                setClienteData(data);
                setModalMessage('Cliente eliminado');
                setModalIsOpen(true); 
            } else {
                const errorData = await response.json();
                setModalMessage(errorData.message);
                setClienteData(null);
                setModalIsOpen(true);
            }
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            setModalMessage('El cliente no existe o ha ocurrido un error interno.');
            setModalIsOpen(true); // Abrir el modal en caso de error
        }
    };      
    
    

    const closeModal = () => setModalIsOpen(false);
    useEffect(() => {
        document.title = 'Eliminar Cliente';
    }, []);

    return (
        <div style={{ marginLeft: '12%' }}>
            <div className="main-block">
                <form onSubmit={handleSubmit}>
                    <h1>Eliminar Cliente</h1>
                    <fieldset>
                        <legend>
                            <h3>Eliminar</h3>
                        </legend>
                        <div className="account-details" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div>
                                <label>Código cliente*</label>
                                <input 
                                    type="text" 
                                    name="input-cod" 
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

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Mensaje" className={"custom-modal"}>
                <h2>Mensaje</h2>
                <p>{modalMessage}</p>
                <button onClick={closeModal}>Cerrar</button>
            </Modal>
        </div>
    );
}

export default EliminarCliente;
