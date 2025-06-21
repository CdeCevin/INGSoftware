import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';
import optionSets from '../../Estilos/regiones';
import Modal from 'react-modal';
import authenticatedFetch from '../../utils/api';

Modal.setAppElement('#root');

function ActualizarDatos() {
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
        document.title = 'Actualizar Empresa';
        const allowedRoles = ['Administrador'];

        if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
            navigate('/login');
        }
    }, [userRole, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            INnombre: nombre || null,
            INtelefono: telefono || null,
            INregion: region || null,
            INciudad: ciudad || null,
            INcalle: calle || null,
            INnumero: numero || null,
        };

        try {
            const response = await authenticatedFetch('/upEmpresa', {
                method: 'POST',
                body: (formData),
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
        setTelefono('');
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
                <h1>Datos Empresa</h1>
                <fieldset>
                    <h3>Actualizar Datos</h3>
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
                        <div className='telefono-wrapper'>
                            <label>Teléfono</label>
                            <span className='cod-area'>+56</span>
                            <input
                                type="text"
                                name="input-teléfono"
                                pattern="[0-9]+"
                                maxLength="9"
                                minLength="9"
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
                                pattern='[0-9]+'
                                maxLength="4"
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

export default ActualizarDatos;