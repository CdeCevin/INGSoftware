import React, { useState, useEffect } from 'react';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Reemplaza '#root' con tu selector de raíz

function IngresoUsuario() {
    const [nombre, setNombre] = useState('');
    const [telefono, settelefono] = useState('');
    const [rut, setRut] = useState('');
    const [tipo, setTipo] = useState('');
    const [password, setpassword] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false); // Estado para abrir/cerrar el modal
    const [modalMessage, setModalMessage] = useState(''); // Mensaje para el modal

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        // Agregar los datos del formulario a FormData
        


        formData.append('INnombre', nombre);
        formData.append('INRut', rut);
        formData.append('INtelefono', telefono);
        formData.append('INRol', tipo);
        formData.append('INpassword', password);


        try {
            // Enviar los datos al backend
            const response = await fetch('http://localhost:3001/api/ingresarUsuario', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setModalMessage(data.message); // Mostrar mensaje de éxito
                // Opcional: Reiniciar el formulario
                resetForm();
            } else {
                const errorData = await response.json();
                setModalMessage(errorData.message); // Mostrar mensaje de error
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            setModalMessage('Error al enviar el formulario.'); // Mensaje de error genérico
        } finally {
            setModalIsOpen(true); // Abrir el modal después de intentar enviar el formulario
        }
    };

    const resetForm = () => {
        setNombre('');
        setRut(''); 
        settelefono('');
        setTipo('');
        setpassword('');
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    useEffect(() => {
        document.title = 'Ingresar Usuario';
    }, []);

    return (
            <div className="main-block">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <h1>Añadir Usuario</h1>
                    <fieldset>
                            <h3>Detalles del Usuario</h3>
                        <div className="account-details">
                            <div>
                                <label>Nombre*</label>
                                <input 
                                    type="text" 
                                    name="INnombre" 
                                    maxLength="50" 
                                    pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$"
                                    required 
                                    value={nombre} 
                                    onChange={(e) => setNombre(e.target.value)} 
                                />
                            </div>
                            <div>
                                <label>RUT*</label>
                                <input 
                                    type="text" 
                                    name="INRut" 
                                    pattern="[0-9]+"
                                    minLength="8"
                                    maxLength="9"
                                    placeholder='No considere puntos ni guión'
                                    required 
                                    value={rut} 
                                    onChange={(e) => setRut(e.target.value)} 
                                />
                            </div>
                            <div>
                                <label>Telefono*</label>
                                <input 
                                    type="text" 
                                    name="INtelefono" 
                                    minLength="9"
                                    maxLength="9"
                                    pattern="[0-9]+"
                                    placeholder='No considere el +56'
                                    required 
                                    value={telefono} 
                                    onChange={(e) => settelefono(e.target.value)} 
                                />
                            </div>
                            <div>
                                <label>Tipo de Usuario</label>
                                <select 
                                    name="INRol"
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
                            
                                <label>Contraseña*</label>  {/* Arreglar esto */}
                                <input 
                                    type="text" 
                                    name="INpassword" 
                                    maxLength="9" 
                                    required 
                                    value={password} 
                                    onChange={(e) => setpassword(e.target.value)} 
                                />
                            </div>
                        </div>
                    </fieldset>
                    <button type="submit">Añadir Usuario</button>
                </form>
            {/* Modal para mostrar mensajes */}
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Mensaje" className={"custom-modal"}>
                <h2>Mensaje</h2>
                <p>{modalMessage}</p>
                <button onClick={closeModal}>Cerrar</button>
            </Modal>
        </div>
    );
}

export default IngresoUsuario;
