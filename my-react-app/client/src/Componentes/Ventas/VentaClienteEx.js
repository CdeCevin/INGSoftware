import React, { useState } from 'react';
import Modal from 'react-modal';

function BuscarCliente() {
    const [codigo, setCodigo] = useState('');
    const [clienteData, setClienteData] = useState(null);
    const [modalMessage, setModalMessage] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("El código es:", codigo);
            const response = await fetch(`http://localhost:3001/api/buscarCliente`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ codigo }) // Enviar el código en el cuerpo
            });
    
            if (response.ok) {
                const data = await response.json();
                setClienteData(data);
                setModalMessage('Cliente encontrado');
                setModalIsOpen(false); // Mantener el modal cerrado si el cliente se encuentra
            } else {
                const errorData = await response.json();
                setModalMessage(errorData.message);
                setClienteData(null);
                setModalIsOpen(true); // Abrir el modal si el cliente no se encuentra
            }
        } catch (error) {
            console.error('Error al buscar cliente:', error);
            setModalMessage('Error al buscar cliente.');
            setModalIsOpen(true); // Abrir el modal en caso de error
        }
    };      
    
    

    const closeModal = () => setModalIsOpen(false);

    return (
        <div style={{ marginLeft: '12%' }}>
            <div className="main-block">
                <form onSubmit={handleSubmit}>
                    <h1>Venta Producto</h1>
                    <fieldset>
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
                    <button type="submit">Buscar</button>
                </form>
            </div>

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Mensaje">
                <h2>Mensaje</h2>
                <p>{modalMessage}</p>
                <button onClick={closeModal}>Cerrar</button>
            </Modal>
        </div>
    );
}

export default BuscarCliente;

