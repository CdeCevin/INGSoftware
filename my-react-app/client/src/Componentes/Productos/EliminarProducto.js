import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import Modal from 'react-modal';
import authenticatedFetch from '../../utils/api';

Modal.setAppElement('#root');

function EliminarProducto() {
    const [codigo, setCodigo] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const navigate = useNavigate();
    const [modalType, setModalType] = useState('');
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        document.title = 'Eliminar Producto';
        const allowedRoles = ['Administrador'];

        if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
            navigate('/login');
        }
    }, [userRole, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await authenticatedFetch('/eliminarProducto', {
                method: 'POST',
                body: ({ codigo })
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
                setModalType('exito');
                resetForm();
            } else {
                const errorData = await response.json();
                setModalMessage(errorData.message);
                setModalType('error');
            }
        } catch (error) {
            setModalMessage('Error al enviar el formulario.');
            setModalType('error');
        } finally {
            setModalIsOpen(true);
        }
    };

    const resetForm = () => {
        setCodigo('');
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

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
                <h1>Eliminar Producto</h1>
                <fieldset>
                    <h3>Eliminar</h3>
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

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Mensaje" className={`custom-modal ${modalType === 'error' ? 'modal-error' : 'modal-exito'}`}>
                <h2>Mensaje</h2>
                <p>{modalMessage}</p>
                <button onClick={closeModal} className={`modal-button ${modalType === 'error' ? 'btn-error' : 'btn-exito'}`}>Cerrar</button>
            </Modal>
        </div>
    );
}

export default EliminarProducto;