import React, { useState } from 'react';
import Modal from 'react-modal';

function AñadirCabecera() {
    const [codigo, setCodigo] = useState('');
    const [clienteData, setClienteData] = useState(null);
    const [modalMessage, setModalMessage] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [paginaActual, setPaginaActual] = useState('insertCabecera'); // Estado para controlar la página actual

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("El código es:", codigo);
            const response = await fetch(`http://localhost:3001/api/insertCabecera`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ codigo })
            });

            if (response.ok) {
                const data = await response.json();
                setClienteData(data);
                setModalMessage('Cliente encontrado');
                setModalIsOpen(false);
                setPaginaActual('nuevaBusqueda'); // Cambia la página al nuevo formulario
            } else {
                const errorData = await response.json();
                setModalMessage(errorData.message);
                setClienteData(null);
                setModalIsOpen(true);
            }
        } catch (error) {
            console.error('Error al buscar cliente:', error);
            setModalMessage('Error al buscar cliente.');
            setModalIsOpen(true);
        }
    };

    const closeModal = () => setModalIsOpen(false);

    return (
        <div style={{ marginLeft: '12%' }}>
            {paginaActual === 'buscarCliente' ? (
                <div className="main-block">
                    <form onSubmit={handleSubmit}>
                        <h1>Venta Producto</h1>
                        <fieldset>
                        <legend>
                            <h3>Cliente Antiguo</h3>
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
                        <button type="submit">Buscar</button>
                    </form>
                </div>
            ) : (
                <div className="main-block">
                    <h1>Nueva Búsqueda</h1>
                    <form>
                        <fieldset>
                        <legend>
                            <h3>Formulario de Ejemplo</h3>
                        </legend>
                            <div className="account-details" style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>
                                    <label>Parámetro de búsqueda*</label>
                                    <input type="text" name="input-param" required />
                                </div>
                            </div>
                        </fieldset>
                        <button type="submit">Buscar</button>
                    </form>
                </div>
            )}

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Mensaje">
                <h2>Mensaje</h2>
                <p>{modalMessage}</p>
                <button onClick={closeModal}>Cerrar</button>
            </Modal>
        </div>
    );
}

export default AñadirCabecera;
