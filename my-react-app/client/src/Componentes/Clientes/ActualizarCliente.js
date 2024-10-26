import React, { useState, useEffect } from 'react';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import optionSets from '../../Estilos/regiones'; // Importa el archivo con regiones y ciudades
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Asegúrate de que el selector de raíz sea correcto

function ActualizarCliente() {
    const [cod, setCod] = useState('');
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [region, setRegion] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [calle, setCalle] = useState('');
    const [numero, setNumero] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false); // Estado para abrir/cerrar el modal
    const [modalMessage, setModalMessage] = useState(''); // Mensaje para el modal

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Preparar los datos en formato JSON
        const formData = {
            cod: cod,
            nombre: nombre || null,
            telefono: telefono || null,
            region: region || null,
            ciudad: ciudad || null,
            calle: calle || null,
            numero: numero || null,
        };
        console.log('Datos del formulario:', formData);

        try {
            // Enviar los datos al backend
            const response = await fetch('http://localhost:3001/api/upCliente', {
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
            setModalMessage('Error al enviar el formulario.'); // Mensaje de error genérico
        } finally {
            setModalIsOpen(true); // Abrir el modal después de intentar enviar el formulario
        }
    };

    const resetForm = () => {
        setNombre('');
        setCod('');
        setRegion('');
        setCiudad('');
        setCalle('');
        setNumero('');
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    useEffect(() => {
        document.title = 'Actualizar Cliente';
    }, []);

    // Manejar cambio en la selección de región
    const handleRegionChange = (e) => {
        setRegion(e.target.value);
        setCiudad(''); // Reiniciar la ciudad al cambiar de región
    };

    return (
        <div style={{ marginLeft: '12%' }}>
            <div className="main-block">
                <form onSubmit={handleSubmit}>
                    <h1>Actualizar Cliente</h1>
                    <fieldset>
                        <legend>
                            <h3>Datos del Cliente</h3>
                        </legend>
                        <div className="account-details" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div>
                                <label>Codigo*</label>
                                <input 
                                    type="text" 
                                    name="input-cod" 
                                    pattern="[0-9]+" 
                                    maxLength="9" 
                                    required 
                                    value={cod} 
                                    onChange={(e) => setCod( e.target.value)} 
                                />
                            </div>
                            
                        </div>
                    </fieldset>
                    <fieldset>   
                        <legend>
                            <h3>Datos a editar</h3>
                        </legend>
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
                            <div>
                                <label>Telefono</label>
                                <input 
                                    type="text" 
                                    name="input-teléfono" 
                                    maxLength="50" 
                                    value={telefono} 
                                    onChange={(e) => setTelefono(e.target.value)} 
                                />
                            </div>
                            <div>
                                <label>Región</label>
                                <select 
                                    value={region} 
                                    onChange={handleRegionChange}
                                    
                                >
                                    <option value="">Selecciona una región</option>
                                    {Object.keys(optionSets).map((regionName) => (
                                        <option key={regionName} value={regionName}>{regionName}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Comuna</label>
                                <select 
                                    value={ciudad} 
                                    onChange={(e) => setCiudad(e.target.value)} 
                                    
                                    disabled={!region}
                                >
                                    <option value="">Selecciona una comuna</option>
                                    {region && optionSets[region].map((city) => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Calle</label>
                                <input 
                                    type="text" 
                                    name="input-calle" 
                                    maxLength="100" 
                                    value={calle} 
                                    onChange={(e) => setCalle(e.target.value)} 
                                />
                            </div>
                            <div>
                                <label>Número</label>
                                <input 
                                    type="text" 
                                    name="input-numero" 
                                    maxLength="100" 
                                    value={numero} 
                                    onChange={(e) => setNumero(e.target.value)} 
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

export default ActualizarCliente;
