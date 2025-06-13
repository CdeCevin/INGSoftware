import React, { useState, useEffect } from 'react';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Reemplaza '#root' con tu selector de raíz

function IngresoProducto() {
    const [nombre, setNombre] = useState('');
    const [codigo, setCodigo] = useState('');
    const [stock, setStock] = useState('');
    const [precio, setPrecio] = useState('');
    const [color, setColor] = useState('');
    const [tipo, setTipo] = useState('');
    const [stockmin, setStockmin] = useState('');
    const [imagen, setImagen] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false); // Estado para abrir/cerrar el modal
    const [modalMessage, setModalMessage] = useState(''); // Mensaje para el modal

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        // Agregar los datos del formulario a FormData
        formData.append('input-nombre', nombre);
        formData.append('input-cod', codigo);
        formData.append('input-stock', stock);
        formData.append('input-precio', precio);
        formData.append('input-color', color);
        formData.append('input-tipo', tipo);
        formData.append('input-stockmin', stockmin);
        formData.append('input-imagen', imagen);
        console.log('Datos del formulario:', {
            codigo, stock, precio, stockmin // Muestra solo los campos numéricos
        });

        try {
            // Enviar los datos al backend
            const response = await fetch('http://localhost:3001/api/ingresar_productos/insertar', {
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
        setCodigo('');
        setStock('');
        setPrecio('');
        setColor('');
        setTipo('');
        setStockmin('');
        setImagen(null);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    useEffect(() => {
        document.title = 'Ingresar Producto';
    }, []);

    return (
            <div className="main-block">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <h1>Añadir Producto</h1>
                    <fieldset>
                        <legend>
                            <h3>Detalles del Producto</h3>
                        </legend>
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
                            <div>
                                <label>Precio*</label>
                                <input 
                                    type="text" 
                                    name="input-precio" 
                                    pattern="[0-9]+" 
                                    maxLength="10" 
                                    required 
                                    value={precio} 
                                    onChange={(e) => setPrecio(e.target.value)} 
                                />
                            </div>
                            <div>
                                <label>Color Producto*</label>
                                <input 
                                    type="text" 
                                    name="input-color" 
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
                                    maxLength="9" 
                                    required 
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
                                    required 
                                    onChange={(e) => setImagen(e.target.files[0])} 
                                />
                            </div>
                        </div>
                    </fieldset>
                    <button type="submit">Añadir</button>
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

export default IngresoProducto;
