import React,{ useEffect } from 'react';
import '../../Estilos/style_menu.css';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import '../../Estilos/estilo.css';

function Inicio() {


    const navigate = useNavigate(); 

    useEffect(() => {
        const userRole = localStorage.getItem('userRole'); 
        const allowedRoles = ['Administrador', 'Vendedor']; 

      
        if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
            navigate('/login'); // Redirige a la página de login si no cumple los requisitos
        }
    }, [navigate]); 
    useEffect(() => {
        document.title = 'Menú';
    }, []);

    

    return (
        <div>
            <div class="main-block">
                <div class="w3-container">
                <h1>¡Bienvenido!</h1>
                <h3>Bienvenido a la aplicación de registro web de Outlet A Tu Hogar.</h3>
                <p>En el menú de su izquierda podrá encontrar las acciones disponibles para el manejo del negocio.
                </p>
                </div>
            </div>
            </div>
    );
}

export default Inicio;