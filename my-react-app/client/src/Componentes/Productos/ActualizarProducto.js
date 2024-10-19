import React, { useState, useEffect } from 'react';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Reemplaza '#root' con tu selector de raíz

function ActualizarProducto() {
    const [nombre, setNombre] = useState('');
    const [codigo, setCodigo] = useState('');
    const [stock, setStock] = useState('');
    const [precio, setPrecio] = useState('');
    const [stockmin, setStockmin] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false); // Estado para abrir/cerrar el modal
    const [modalMessage, setModalMessage] = useState(''); // Mensaje para el modal

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        // Agregar los datos del formulario a FormData
        formData.append('input-nombre', nombre || null);
        formData.append('input-cod', codigo);
        formData.append('input-stock', stock || null);
        formData.append('input-precio', precio || null);
        formData.append('input-stockmin', stockmin || null);
        console.log('Datos del formulario:', {
            codigo, stock, precio, stockmin // Muestra solo los campos numéricos
        });

        try {
            // Enviar los datos al backend
            const response = await fetch('http://localhost:3001/api/up_producto/', {
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
        setStockmin('');
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    useEffect(() => {
        document.title = 'Actualizar Producto';
    }, []);

    return (
        <div style={{ marginLeft: '12%' }}>
            <div className="main-block">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <h1>Actualizar Producto</h1>
                    <fieldset>
                        <legend>
                            <h3>Producto a Editar</h3>
                        </legend>
                        <div className="account-details" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div>
                                <label>Código Mueble*</label>
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
                    <fieldset>   
                        <legend>
                            <h3>Producto a Editar</h3>
                        </legend>
                        <div className="account-details" style={{ display: 'flex', flexWrap: 'wrap' }} >
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
                                <label>Precio</label>
                                <input 
                                    type="text" 
                                    name="input-precio" 
                                    pattern="[0-9]+" 
                                    maxLength="10" 
                                     
                                    value={precio} 
                                    onChange={(e) => setPrecio(e.target.value)} 
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
                                    maxLength="9" 
                                    value={stockmin} 
                                    onChange={(e) => setStockmin(e.target.value)} 
                                    
                                />
                            </div>
                                
                        </div>     
                    </fieldset>
                    <button type="submit">Actualizar</button>
                </form>
                </div>
            {/* Modal para mostrar mensajes */}
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Mensaje">
                <h2>Mensaje</h2>
                <p>{modalMessage}</p>
                <button onClick={closeModal}>Cerrar</button>
            </Modal>
        </div>
    );
}

export default ActualizarProducto;
