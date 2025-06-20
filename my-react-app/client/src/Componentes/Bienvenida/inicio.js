import React,{ useEffect,useState } from 'react';
import '../../Estilos/style_menu.css';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import '../../Estilos/estilo.css';

function Inicio() {


    const navigate = useNavigate(); 
    const [isLoading, setIsLoading] = useState(false); // Nuevo estado para controlar la carga/verificación
    useEffect(() => {
        const userRole = localStorage.getItem('userRole'); 
        const allowedRoles = ['Administrador', 'Vendedor']; 

      
        if (!localStorage.getItem('token') || !userRole || !allowedRoles.includes(userRole)) {
            navigate('/login', { replace: true }); // Redirige a la página de login si no cumple los requisitos
        } else {
            // Si todo está bien, indica que la verificación ha terminado
            setIsLoading(true); 
        }
    }, [navigate]); 
 
   useEffect(() => {
        document.title = 'Menú';
    }, []);

    if (isLoading) {
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
}

export default Inicio;