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
            console.log("El kodigo es>", codigo);
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
            } else {
                const errorData = await response.json();
                setModalMessage(errorData.message);
                setClienteData(null);
            }
        } catch (error) {
            console.error('Error al buscar cliente:', error);
            setModalMessage('Error al buscar cliente.');
        } finally {
            setModalIsOpen(true);
        }
    };
    

    const closeModal = () => setModalIsOpen(false);

    return (
        <div style={{ marginLeft: '12%' }}>
            <div className="main-block">
                <form onSubmit={handleSubmit}>
                    <h1>Buscar Cliente</h1>
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

                {clienteData && (
                    <div className="client-details">
                        <h2>Detalles del Cliente</h2>
                        <p><strong>Nombre:</strong> {clienteData.nombres}</p>
                        <p><strong>Teléfono:</strong> {clienteData.telefono}</p>
                        <p><strong>Dirección:</strong> {clienteData.direccion}</p>
                    </div>
                )}
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
