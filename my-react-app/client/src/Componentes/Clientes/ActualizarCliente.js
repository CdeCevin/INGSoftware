import React, { useState, useEffect } from 'react';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import optionSets from '../../Estilos/regiones';
import Modal from 'react-modal';
import authenticatedFetch from '../../utils/api';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

function ActualizarCliente() {
    const [cod, setCod] = useState('');
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [region, setRegion] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [calle, setCalle] = useState('');
    const [numero, setNumero] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        document.title = 'Actualizar Cliente';
        const allowedRoles = ['Administrador', 'Vendedor'];

        if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
            navigate('/login');
        }
    }, [userRole, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            cod: cod,
            INnombre: nombre || null,
            INtelefono: telefono || null,
            INregion: region || null,
            INciudad: ciudad || null,
            INcalle: calle || null,
            INnumero: numero || null,
        };

        try {
            const response = await authenticatedFetch('/upCliente', {
                method: 'POST',
                body: JSON.stringify(formData),
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
            setModalMessage('El cliente no existe o ha ocurrido un error interno.');
        } finally {
            setModalIsOpen(true);
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

    const handleRegionChange = (e) => {
        setRegion(e.target.value);
        setCiudad('');
    };

    const allowedRoles = ['Administrador', 'Vendedor'];
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
                <h1>Actualizar Cliente</h1>
                <fieldset>
                    <h3>Cliente a Editar</h3>
                    <div className="account-details" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div>
                            <label>Código*</label>
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
                    <h3>Datos a editar</h3>
                    <div className="account-details" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div>
                            <label>Nombre</label>
                            <input 
                                type="text" 
                                name="input-nombre" 
                                maxLength="50" 
                                value={nombre} 
                                pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$"
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
                                maxLength="4" 
                                pattern="[0-9]+"
                                value={numero} 
                                onChange={(e) => setNumero(e.target.value)} 
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

export default ActualizarCliente;