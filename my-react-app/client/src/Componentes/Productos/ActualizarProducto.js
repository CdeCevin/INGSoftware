// CdeCevin/INGSoftware/my-react-app/client/src/Componentes/Productos/ActualizarProducto.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import Modal from 'react-modal';
import authenticatedFetch from '../../utils/api';

Modal.setAppElement('#root');

function ActualizarProducto() {
    const [nombre, setNombre] = useState('');
    const [codigo, setCodigo] = useState('');
    const [stock, setStock] = useState('');
    const [precio, setPrecio] = useState('');
    const [stockmin, setStockmin] = useState('');
    const [imagen, setImagen] = useState(null); // Almacena el archivo File
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        document.title = 'Actualizar Producto';
        const allowedRoles = ['Administrador'];

        if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
            navigate('/login');
        }
    }, [userRole, navigate]);

    // Función para manejar el cambio en el input de tipo 'file'
    const handleImageChange = (e) => {
        setImagen(e.target.files[0]); // Captura el archivo seleccionado
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        // Anexar todos los campos de texto
        formData.append('inputNombre', nombre || ''); // Envía cadena vacía si es null/undefined
        formData.append('inputCod', codigo);
        formData.append('inputStock', stock || '');
        formData.append('inputPrecio', precio || '');
        formData.append('inputStockmin', stockmin || '');
        
        if (imagen) {
            formData.append('input-imagen', imagen); 
        }

        try {
            const response = await authenticatedFetch(`/up_producto/${codigo}`, {
                method: 'PUT', // PUT EN VEZ DE POST, no se si debemos cambiarlo en los demás pero para probar
                body: formData,
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
                setModalMessage(errorData.message || 'Error desconocido al actualizar el producto.');
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            setModalMessage('Error de conexión al servidor.');
        } finally {
            setModalIsOpen(true);
        }
    };

    const resetForm = () => {
        setNombre('');
        setCodigo('');
        setStock('');
        setPrecio('');
        setStockmin('');
        setImagen(null);
        const fileInput = document.querySelector('input[type="file"][name="input-imagen"]');
        if (fileInput) {
            fileInput.value = '';
        }
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
                <h1>Actualizar Producto</h1>
                <fieldset>
                    <h3>Producto a Editar</h3>
                    <div className="account-details" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div>
                            <label>Código Producto*</label>
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
                <br></br>
                <fieldset>
                    <h3>Detalles del Producto</h3>
                    <div className="account-details" style={{ display: 'flex', flexWrap: 'wrap' }}>
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
                        <div className='input-wrapper'>
                            <label>Precio</label>
                            <span className='valor'>$</span>
                            <input
                                type="text"
                                name="input-precio"
                                pattern="[0-9]+"
                                maxLength="10"
                                placeholder='No considere puntos ni signos'
                                value={precio}
                                onChange={(e) => setPrecio(e.target.value)}
                                style={{paddingLeft: "40px"}}
                            />
                        </div>
                        <div>
                            <label>Stock</label>
                            <input
                                type="text"
                                name="input-stock"
                                pattern="[0-9]+"
                                maxLength="4"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Stock Mínimo</label>
                            <input
                                type="text"
                                name="input-stockmin"
                                maxLength="4"
                                pattern="[0-9]+"
                                value={stockmin}
                                onChange={(e) => setStockmin(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Imagen del Producto</label>
                            <input
                                type="file"
                                name="input-imagen" 
                                accept="image/*"
                                onChange={handleImageChange} 
                            />
                        </div>
                    </div>
                </fieldset>
                <button type="submit">Actualizar</button>
            </form>

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Mensaje" className={"custom-modal"}>
                <h2>Mensaje</h2>
                <p>{modalMessage}</p>
                <button onClick={closeModal}>Cerrar</button>
            </Modal>
        </div>
    );
}

export default ActualizarProducto;