import React, { useState, useEffect } from 'react';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import optionSets from '../../Estilos/regiones'; // Importa el archivo con regiones y ciudades
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Asegúrate de que el selector de raíz sea correcto

function ActualizarUsuario() {
    const [rut, setrut] = useState('');
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [password, setpassword] = useState('');
    const [tipo, setTipo] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false); // Estado para abrir/cerrar el modal
    const [modalMessage, setModalMessage] = useState(''); // Mensaje para el modal

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Preparar los datos en formato JSON
        const formData = {
            rut: rut,
            INnombre: nombre || null,
            INtelefono: telefono || null,
            INtipo: tipo || null,
            INpassword: password || null,


        };
        console.log('Datos del formulario:', formData);

        try {
            // Enviar los datos al backend
            const response = await fetch('http://localhost:3001/api/upUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                setModalMessage(data.message); // Mostrar mensaje de éxito
                resetForm();
            } else {
                const errorData = await response.json();
                setModalMessage(errorData.message); // Mostrar mensaje de error
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            setModalMessage('El Usuario no existe o ha ocurrido un error interno.'); // Mensaje de error genérico
        } finally {
            setModalIsOpen(true); // Abrir el modal después de intentar enviar el formulario
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

    useEffect(() => {
        document.title = 'Actualizar Usuario';
    }, []);

    // Manejar cambio en la selección de región

    return (
        <div style={{ marginLeft: '12%' }}>
            <div className="main-block">
                <form onSubmit={handleSubmit}>
                    <h1>Actualizar Usuario</h1>
                    <fieldset>
                        <legend>
                            <h3>Usuario a Editar</h3>
                        </legend>
                        <div className="account-details" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div>
                                <label>Rut*</label>
                                <input 
                                    type="text" 
                                    name="input-rut" 
                                    pattern="[0-9]+" 
                                    maxLength="10" 
                                    required 
                                    value={rut} 
                                    onChange={(e) => setrut( e.target.value)} 
                                />
                            </div>
                            
                        </div>
                    </fieldset>
                    <fieldset>   
                        <legend>
                            <h3>Datos a editar</h3>
                        </legend>
                        <div className="account-details" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div>
                                <label>Nombre</label>
                                <input 
                                    type="text" 
                                    name="input-nombre" 
                                    maxLength="50" 
                                    value={nombre} 
                                    onChange={(e) => setNombre(e.target.value)} 
                                />
                            </div>
                            <div>
                                <label>Teléfono</label>
                                <input 
                                    type="text" 
                                    name="input-teléfono" 
                                    maxLength="9" 
                                    value={telefono} 
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
                                    <option value="">Seleccionar</option> {/*El valor por defecto, luego debe ser el valor que ya está, getUserRol*/}
                                    <option value="Vendedor">Vendedor</option>
                                    <option value="Administrador">Administrador</option>
                                </select>
                            </div>
                            <div>
                                <label>Contraseña</label>
                                <input 
                                    type="password" 
                                    name="input-password" 
                                    maxLength="50" 
                                    value={password} 
                                    onChange={(e) => setpassword(e.target.value)} 
                                />
                            </div>
                        </div>
                    </fieldset>
                    <button type="submit">Actualizar</button>
                </form>
            </div>
            {/* Modal para mostrar mensajes */}
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Mensaje" className={"custom-modal"}>
                <h2>Mensaje</h2>
                <p>{modalMessage}</p>
                <button onClick={closeModal}>Cerrar</button>
            </Modal>
        </div>
    );
}

export default ActualizarUsuario;
