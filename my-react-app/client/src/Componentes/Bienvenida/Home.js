// C:\Users\Koliv\INGSoftware\my-react-app\client\src\Home.js (con mejora de renderizado)

import React, { useEffect, useState } from 'react'; // Importa useState
import { useNavigate } from 'react-router-dom';
import Inicio from './inicio';

function Home() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true); // Nuevo estado para controlar la carga/verificación

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole');
        const allowedRoles = ['Administrador', 'Vendedor'];

        if (!token || !userRole || !allowedRoles.includes(userRole)) {
            navigate('/login');
        } else {
            // Si todo está bien, indica que la verificación ha terminado
            setIsLoading(false); 
        }
    }, [navigate]);

    // Si isLoading es true, no renderza el contenido de Inicio aún
    if (isLoading) {
        return (
            <div className="main-block">
                <h1>Cargando...</h1>
            </div>
        );
    }

    // Si isLoading es false (significa que el usuario está autenticado y autorizado), renderiza Inicio
    return (
        <Inicio />
    );
}

export default Home;