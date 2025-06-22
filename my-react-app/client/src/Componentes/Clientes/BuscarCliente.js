import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import authenticatedFetch from '../../utils/api';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

function BuscarCliente() {
    const [codigo, setCodigo] = useState('');
    const [clienteData, setClienteData] = useState(null);
    const [modalMessage, setModalMessage] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        document.title = 'Buscar Cliente';
        const allowedRoles = ['Administrador', 'Vendedor'];

        if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
            navigate('/login');
        }
    }, [userRole, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await authenticatedFetch('/buscarCliente', {
                method: 'POST',
                body: {codigo},
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
                setClienteData(data);
                setModalMessage('Cliente encontrado');
                setModalIsOpen(false);
                setModalType('exito');
            } else {
                const errorData = await response.json();
                setModalMessage(errorData.message);
                setClienteData(null);
                setModalIsOpen(true);
                setModalType('error');
            }
        } catch (error) {
            setModalMessage('Error al buscar cliente.');
            setModalIsOpen(true);
            setModalType('error');
        }
    };

    const closeModal = () => setModalIsOpen(false);

    const allowedRoles = ['Administrador', 'Vendedor'];
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
                <h1>Buscar Cliente</h1>
                <fieldset>
                    <h3>Búsqueda</h3>
                    <div className="account-details" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div>
                            <label>Código*</label>
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
                <fieldset>
                    <h3>Resultados</h3>
                    <table className="venta-table">
                        <thead>
                            <tr>
                                <th>NOMBRE</th>
                                <th>TELÉFONO</th>
                                <th>DIRECCIÓN</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{clienteData.nombres}</td>
                                <td>{clienteData.telefono}</td>
                                <td>{clienteData.direccion}</td>
                            </tr>
                        </tbody>
                    </table>
                </fieldset>
            )}

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Mensaje" className={`custom-modal ${modalType === 'error' ? 'modal-error' : 'modal-exito'}`}>
                <h2>Mensaje</h2>
                <p>{modalMessage}</p>
                <button onClick={closeModal} className={`modal-button ${modalType === 'error' ? 'btn-error' : 'btn-exito'}`}>Cerrar</button>
            </Modal>
        </div>
    );
}

export default BuscarCliente;