import React, { useEffect } from 'react'; // Importa useEffect
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import Inicio from './inicio';

function Home() {
    const navigate = useNavigate(); // Inicializa useNavigate aquí, fuera del useEffect

    useEffect(() => {
        const userRole = localStorage.getItem('userRole'); // Obtén el rol aquí dentro del useEffect
        const allowedRoles = ['Administrador', 'Vendedor']; // Define los roles permitidos. Asegúrate de que coincidan exactamente con lo que guardas en localStorage.

        // Verifica si el usuario no tiene token, no tiene rol o el rol no está permitido
        if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
            navigate('/login'); // Redirige a la página de login si no cumple los requisitos
        }
    }, [navigate]); // navigate es una dependencia para useEffect, userRole ya no es necesario aquí si lo lees internamente

    return (
        <Inicio />
    );
}

export default Home;