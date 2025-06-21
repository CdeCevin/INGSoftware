import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import Modal from 'react-modal';
import authenticatedFetch from '../../utils/api';

Modal.setAppElement('#root');

function IngresoProducto() {
    const [nombre, setNombre] = useState('');
    const [codigo, setCodigo] = useState('');
    const [stock, setStock] = useState('');
    const [precio, setPrecio] = useState('');
    const [color, setColor] = useState('');
    const [tipo, setTipo] = useState('');
    const [stockmin, setStockmin] = useState('');
    const [imagen, setImagen] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        document.title = 'Ingresar Producto';
        const allowedRoles = ['Administrador'];

        if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
            navigate('/login');
        }
    }, [userRole, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('input-nombre', nombre);
        formData.append('input-cod', codigo);
        formData.append('input-stock', stock);
        formData.append('input-precio', precio);
        formData.append('input-color', color);
        formData.append('input-tipo', tipo);
        formData.append('input-stockmin', stockmin);
        formData.append('input-imagen', imagen);

        try {
            const response = await authenticatedFetch('/ingresar_productos/insertar', {
                method: 'POST',
                body: formData,
                isFormData: true,
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
            setModalMessage('Error al enviar el formulario.');
        } finally {
            setModalIsOpen(true);
        }
    };

    const resetForm = () => {
        setNombre('');
        setCodigo('');
        setStock('');
        setPrecio('');
        setColor('');
        setTipo('');
        setStockmin('');
        setImagen(null);
        const fileInput = document.querySelector('input[type="file"]');
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
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <h1>Añadir Producto</h1>
                <fieldset>
                    <h3>Detalles del Producto</h3>
                    <div className="account-details">
                        <div>
                            <label>Nombre*</label>
                            <input
                                type="text"
                                name="input-nombre"
                                maxLength="50"
                                required
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </div>
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
                        <div>
                            <label>Stock*</label>
                            <input
                                type="text"
                                name="input-stock"
                                pattern="[0-9]+"
                                maxLength="4"
                                required
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                            />
                        </div>
                        <div className='input-wrapper'>
                            <label>Precio*</label>
                            <span className='valor'>$</span>
                            <input
                                type="text"
                                name="input-precio"
                                pattern="[0-9]+"
                                maxLength="10"
                                required
                                value={precio}
                                placeholder='No considere puntos ni signos'
                                onChange={(e) => setPrecio(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Color Producto*</label>
                            <input
                                type="text"
                                name="input-color"
                                maxLength="15"
                                pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$"
                                required
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Tipo Producto*</label>
                            <input
                                type="text"
                                name="input-tipo"
                                maxLength="9"
                                required
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Stock Mínimo*</label>
                            <input
                                type="text"
                                name="input-stockmin"
                                maxLength="4"
                                pattern="[0-9]+"
                                required
                                value={stockmin}
                                onChange={(e) => setStockmin(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Imagen del Producto*</label>
                            <input
                                type="file"
                                name="input-imagen"
                                accept="image/*"
                                required
                                onChange={(e) => setImagen(e.target.files[0])}
                            />
                        </div>
                    </div>
                </fieldset>
                <button type="submit">Añadir</button>
            </form>

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Mensaje" className={"custom-modal"}>
                <h2>Mensaje</h2>
                <p>{modalMessage}</p>
                <button onClick={closeModal}>Cerrar</button>
            </Modal>
        </div>
    );
}

export default IngresoProducto;