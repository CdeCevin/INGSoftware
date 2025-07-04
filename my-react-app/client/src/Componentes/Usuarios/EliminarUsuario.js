import React, { useState, useEffect } from 'react';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import Modal from 'react-modal';
import authenticatedFetch from '../../utils/api';
import { useNavigate } from 'react-router-dom'; 

Modal.setAppElement('#root');

function EliminarUsuario() {
    const navigate = useNavigate(); 
    const userRole = localStorage.getItem('userRole'); 
    const [Rut_Usuario, setRut_Usuario] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false); 
    const [modalMessage, setModalMessage] = useState(''); 
    const [modalType, setModalType] = useState('');

    useEffect(() => {
        document.title = 'Agregar Usuario';
        const allowedRoles = ['Administrador'];

        if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
            navigate('/login');
        }
    }, [userRole, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log("Valor de código antes de enviar:", Rut_Usuario); // Verifica si el valor se está capturando correctamente
        
        try {
            // Enviar los datos al backend como JSON
            const response = await authenticatedFetch('/eliminarUsuario', {
                method: 'POST',
                body: ({ Rut_Usuario }) // Enviar el código del Usuario como JSON
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
            } else {
                const errorData = await response.json();
                setModalMessage(errorData.message);
                setModalType('error');
            }
        } catch (error) {
            setModalMessage('El usuario no existe o ha ocurrido un error interno.');
            setModalType('error');
        } finally {
            setModalIsOpen(true);
        }
    };
    
    

    const resetForm = () => {
        setRut_Usuario('');
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    useEffect(() => {
        document.title = 'Eliminar Usuario';
    }, []);

    return (
            <div className="main-block">
                <form onSubmit={handleSubmit}>
                    <h1>Eliminar Usuario</h1>
                    <fieldset>
                            <h3>Eliminar</h3>
                        <div className="account-details" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div>
                                <label>RUT*</label>
                                <input 
                                    type="text" 
                                    name="Rut_Usuario" 
                                    pattern="[0-9]+" 
                                    minLength="7"
                                    maxLength="9" 
                                    placeholder='No considere puntos ni guión' 
                                    required 
                                    value={Rut_Usuario} 
                                    onChange={(e) => setRut_Usuario(e.target.value)} 
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

export default EliminarUsuario;
