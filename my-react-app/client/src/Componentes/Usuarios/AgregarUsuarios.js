import React, { useState, useEffect } from 'react';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import Modal from 'react-modal';
import authenticatedFetch from '../../utils/api'; 
import { useNavigate } from 'react-router-dom'; 

Modal.setAppElement('#root');

function IngresoUsuario() {
    const [nombre, setNombre] = useState('');
    const [telefono, settelefono] = useState('');
    const [rut, setRut] = useState('');
    const [tipo, setTipo] = useState('');
    const [password, setpassword] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const navigate = useNavigate(); 
    const userRole = localStorage.getItem('userRole'); 
    
    useEffect(() => {
        document.title = 'Agregar Usuario';
        const allowedRoles = ['Administrador'];

        if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
            navigate('/login');
        }
    }, [userRole, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Convertir FormData a un objeto JSON para usar con authenticatedFetch
        // FormData es más común para uploads de archivos. Para JSON, es mejor un objeto simple.
        const formData = {
            INnombre: nombre,
            INRut: rut,
            INtelefono: telefono,
            INRol: tipo,
            INpassword: password,
        };

        try {
            const response = await authenticatedFetch('/ingresarUsuario', {
                method: 'POST',
                // No es necesario 'Content-Type': 'application/json' aquí, authenticatedFetch ya lo maneja
                body: JSON.stringify(formData), // Enviamos el objeto como JSON
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
                resetForm();
            } else {
                const errorData = await response.json();
                setModalMessage(errorData.message);
            }
        } catch (error) {
            setModalMessage('Error al enviar el formulario o problema de conexión.');
        } finally {
            setModalIsOpen(true);
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
                            <label>Contraseña*</label>
                            <input 
                                type="password" // Cambiado a type="password" para seguridad
                                name="INpassword" 
                                maxLength="50" // Aumentado a 50 para contraseñas, no 9 (como el rut)
                                required 
                                value={password} 
                                onChange={(e) => setpassword(e.target.value)} 
                            />
                        </div>
                    </div>
                </fieldset>
                <button type="submit">Añadir Usuario</button>
            </form>
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Mensaje" className={"custom-modal"}>
                <h2>Mensaje</h2>
                <p>{modalMessage}</p>
                <button onClick={closeModal}>Cerrar</button>
            </Modal>
        </div>
    );
}

export default IngresoUsuario;