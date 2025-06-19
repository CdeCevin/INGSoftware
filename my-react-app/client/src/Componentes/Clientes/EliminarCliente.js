import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import authenticatedFetch from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';

Modal.setAppElement('#root');

function EliminarCliente() {
    const [codigo, setCodigo] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        document.title = 'Eliminar Cliente';
        const allowedRoles = ['Administrador'];

        if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
            navigate('/login');
        }
    }, [userRole, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await authenticatedFetch('/eliminarCliente', {
                method: 'POST',
                body: JSON.stringify({ codigo }),
            });

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userRut');
                navigate('/login');
                return;
            }

            if (response.ok) {
                const data = await response.json();
                setModalMessage(data.message);
            } else {
                const errorData = await response.json();
                setModalMessage(errorData.message);
            }
        } catch (error) {
            setModalMessage('El cliente no existe o ha ocurrido un error interno.');
        } finally {
            setModalIsOpen(true);
        }
    };

    const closeModal = () => setModalIsOpen(false);

    const allowedRoles = ['Administrador'];
    if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
        return (
            <div className="main-block">
                <h1>Redirigiendo...</h1>
            </div>
        );
    }

    return (
        <div className="main-block">
            <form onSubmit={handleSubmit}>
                <h1>Eliminar Cliente</h1>
                <fieldset>
                    <h3>Eliminar</h3>
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
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Mensaje" className={"custom-modal"}>
                <h2>Mensaje</h2>
                <p>{modalMessage}</p>
                <button onClick={closeModal}>Cerrar</button>
            </Modal>
        </div>
    );
}

export default EliminarCliente;