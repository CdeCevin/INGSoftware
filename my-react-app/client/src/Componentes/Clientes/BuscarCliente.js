import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import authenticatedFetch from '../../utils/api';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

function BuscarCliente() {
    const [valorBusqueda, setValorBusqueda] = useState('');
    const [clientesEncontrados, setClientesEncontrados] = useState([]);
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
        setClientesEncontrados([]); // Limpiar resultados anteriores
        try {
            const response = await authenticatedFetch('/buscarCliente', {
                method: 'POST',
                // Enviamos 'valorBusqueda'
                body: { valorBusqueda },
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

                // Adapta la visualización de los resultados
                // Si la respuesta es un array (múltiples clientes por nombre)
                // o un objeto único (un cliente por código)
                if (Array.isArray(data)) {
                    setClientesEncontrados(data);
                } else {
                    // Si es un objeto único, se pone en un array para la tabla
                    setClientesEncontrados([data]);
                }

                if (clientesEncontrados.length > 0) { // Verifica si se encontraron clientes
                    setModalMessage('Cliente(s) encontrado(s).');
                    setModalType('exito');
                } else {
                    setModalMessage('No se encontraron clientes.');
                    setModalType('error');
                }
                setModalIsOpen(false);


            } else {
                const errorData = await response.json();
                setModalMessage(errorData.message);
                setClientesEncontrados([]);
                setModalIsOpen(true);
                setModalType('error');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            setModalMessage('Error al buscar cliente.');
            setClientesEncontrados([]);
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
                            <label>Código o Nombre*</label>
                            <input
                                type="text"
                                name="input-busqueda"
                                required
                                value={valorBusqueda}
                                onChange={(e) => setValorBusqueda(e.target.value)}
                            />
                        </div>
                    </div>
                </fieldset>
                <button type="submit">Buscar</button>
            </form>

            {clientesEncontrados.length > 0 && (
                <fieldset>
                    <h3>Resultados</h3>
                    <table className="venta-table">
                        <thead>
                            <tr>
                                <th>CÓDIGO</th>
                                <th>NOMBRE</th>
                                <th>TELÉFONO</th>
                                <th>DIRECCIÓN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientesEncontrados.map((cliente, index) => (
                                <tr key={index}>
                                    <td>{cliente.codigo}</td>
                                    <td>{cliente.nombres}</td>
                                    <td>{cliente.telefono}</td>
                                    <td>{cliente.direccion}</td>
                                </tr>
                            ))}
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