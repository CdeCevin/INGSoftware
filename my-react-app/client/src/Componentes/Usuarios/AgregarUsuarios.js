import React, { useState, useEffect } from 'react';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Reemplaza '#root' si usas otro id en tu HTML

function IngresoUsuario() {
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [rut, setRut] = useState('');
    const [tipo, setTipo] = useState('');
    const [password, setPassword] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            INnombre: nombre,
            INRut: rut,
            INtelefono: telefono,
            INRol: tipo,
            INpassword: password,
        };

        try {
            const response = await fetch('http://localhost:3001/api/ingresarUsuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setModalMessage(data.message || 'Usuario añadido correctamente.');
                resetForm();
            } else {
                setModalMessage(data.message || 'Ocurrió un error al añadir el usuario.');
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            setModalMessage('Error al conectar con el servidor.');
        } finally {
            setModalIsOpen(true);
        }
    };

    const resetForm = () => {
        setNombre('');
        setRut('');
        setTelefono('');
        setTipo('');
        setPassword('');
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    useEffect(() => {
        document.title = 'Ingresar Usuario';
    }, []);

    return (
        <div style={{ marginLeft: '12%' }}>
            <div className="main-block">
                <form onSubmit={handleSubmit}>
                    <h1>Añadir Usuario</h1>
                    <fieldset>
                        <legend>
                            <h3>Detalles del Usuario</h3>
                        </legend>
                        <div className="account-details">
                            <div>
                                <label>Nombre*</label>
                                <input 
                                    type="text"
                                    maxLength="50"
                                    required
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>RUT*</label>
                                <input 
                                    type="text"
                                    maxLength="10"
                                    required
                                    value={rut}
                                    onChange={(e) => setRut(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Teléfono*</label>
                                <input 
                                    type="text"
                                    pattern="[0-9]+"
                                    maxLength="9"
                                    required
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Tipo de Usuario*</label>
                                <select 
                                    required
                                    value={tipo}
                                    onChange={(e) => setTipo(e.target.value)}
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="Administrador">Administrador</option>
                                    <option value="Vendedor">Vendedor</option>
                                </select>
                            </div>
                            <div>
                                <label>Contraseña*</label>
                                <input 
                                    type="password"
                                    maxLength="50"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </fieldset>
                    <button type="submit">Añadir Usuario</button>
                </form>
            </div>

            {/* Modal para mostrar mensajes */}
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Mensaje" className="custom-modal">
                <h2>Mensaje</h2>
                <p>{modalMessage}</p>
                <button onClick={closeModal}>Cerrar</button>
            </Modal>
        </div>
    );
}

export default IngresoUsuario;
