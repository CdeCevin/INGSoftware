import React, { useEffect } from 'react'; // Importa useEffect
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import Inicio from './inicio';

function Home() {
    const navigate = useNavigate(); 

    useEffect(() => {
        const userRole = localStorage.getItem('userRole'); 
        const allowedRoles = ['Administrador', 'Vendedor']; 

      
        if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
            navigate('/login'); // Redirige a la página de login si no cumple los requisitos
        }
    }, [navigate]); 

    return (
        <Inicio />
    );
}

export default Home;