// CdeCevin/INGSoftware/my-react-app/client/src/Componentes/ActualizarUsuario/ActualizarUsuario.js 

import React, { useState, useEffect } from 'react';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import optionSets from '../../Estilos/regiones'; 
import Modal from 'react-modal';
import authenticatedFetch from '../../utils/api'; 
import { useNavigate } from 'react-router-dom'; 

Modal.setAppElement('#root'); 

function ActualizarUsuario() {
    const navigate = useNavigate(); 
    const userRole = localStorage.getItem('userRole'); 

    const [rut, setrut] = useState('');
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [password, setpassword] = useState('');
    const [tipo, setTipo] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false); 
    const [modalMessage, setModalMessage] = useState(''); 

    // --- MODIFICACIONES CLAVE AQUÍ: Lógica de verificación de rol y redirección ---
    useEffect(() => {
        document.title = 'Actualizar Usuario';
        const allowedRoles = ['Administrador','Vendedor']; // Solo administradores pueden actualizar usuarios

        if (!userRole || !allowedRoles.includes(userRole)) {
            console.warn("Acceso denegado. Redirigiendo al login.");
            navigate('/login'); // Redirige directamente al login
            // No se establecen mensajes ni se abre el modal aquí para una redirección inmediata
        }
    }, [userRole, navigate]); // Dependencias para re-ejecutar si el rol o navigate cambian
    // ---------------------------------------------------------------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            rut: rut,
            INnombre: nombre || null,
            INtelefono: telefono || null,
            INtipo: tipo || null,
            INpassword: password || null,
        };
        console.log('Datos del formulario:', formData);

        try {
            const response = await authenticatedFetch('/upUser', {
                method: 'POST',
                body: JSON.stringify(formData),
            });

            // --- MODIFICACIONES AQUÍ: Redirección inmediata para 401/403 ---
            if (response.status === 401 || response.status === 403) {
                console.error("Error de autenticación/autorización. Redirigiendo al login.");
                navigate('/login'); // Redirige directamente al login sin mensaje intermedio
                return; 
            }
            // ---------------------------------------------------------------

            if (response.ok) {
                const data = await response.json();
                setModalMessage(data.message); 
                resetForm();
            } else {
                const errorData = await response.json();
                setModalMessage(errorData.message || 'Error al actualizar el usuario.'); 
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            setModalMessage('No se pudo conectar al servidor o un error inesperado ocurrió.'); 
        } finally {
            setModalIsOpen(true); // El modal se sigue usando para los mensajes de éxito/fracaso de la operación (no de la autenticación)
        }
    };

    const resetForm = () => {
        setNombre('');
        setrut('');
        setTelefono('');
        setTipo('');
        setpassword('');
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div className="main-block">
            <form onSubmit={handleSubmit}>
                <h1>Actualizar Usuario</h1>
                <fieldset>
                    <h3>Usuario a Editar</h3>
                    <div className="account-details" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div>
                            <label>Rut*</label>
                            <input
                                type="text"
                                name="input-rut"
                                pattern="[0-9]+"
                                minLength="8"
                                maxLength="9"
                                placeholder='No considere puntos ni guión'
                                required
                                value={rut}
                                onChange={(e) => setrut( e.target.value)}
                            />
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <h3>Datos a editar</h3>
                    <div className="account-details" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div>
                            <label>Nombre</label>
                            <input
                                type="text"
                                name="input-nombre"
                                maxLength="50"
                                pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Teléfono</label>
                            <input
                                type="text"
                                name="input-teléfono"
                                minLength="9"
                                maxLength="9"
                                pattern="[0-9]+"
                                value={telefono}
                                placeholder='No considere el +56'
                                onChange={(e) => setTelefono(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Tipo de Usuario</label>
                            <select
                                name="input-tipo"
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                            >
                                <option value="">Seleccionar</option>
                                <option value="Vendedor">Vendedor</option>
                                <option value="Administrador">Administrador</option>
                            </select>
                        </div>
                        <div>
                            <label>Contraseña</label>
                            <input
                                type="password"
                                name="input-password"
                                minLength="8"
                                maxLength="16"
                                placeholder='Utilice una contraseña de 8 a 16 caracteres'
                                pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$"
                                value={password}
                                onChange={(e) => setpassword(e.target.value)}
                            />
                        </div>
                    </div>
                </fieldset>
                <button type="submit">Actualizar</button>
            </form>
            {/* El modal se usa solo para mensajes de éxito/error de la operación de actualización */}
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Mensaje" className={"custom-modal"}>
                <h2>Mensaje</h2>
                <p>{modalMessage}</p>
                <button onClick={closeModal}>Cerrar</button>
            </Modal>
        </div>
    );
}

export default ActualizarUsuario;