import React,{ useEffect } from 'react';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';

function Inicio() {
    useEffect(() => {
        document.title = 'Menú';
    }, []);

    return (
        <div>
            <div class="bloqueprincipal">
            <div style={{ marginLeft: '5%' }}>
                <div class="w3-container">
                <h1>hola chavales!</h1>
                <h3>Bienvenido a la aplicación de registro web de Outlet A Tu Hogar.</h3>
                <p>En el menú de su izquierda podrá encontrar las acciones disponibles para el manejo del negocio.
                </p>
                </div>
            </div>
            </div>
            
        </div>
    );
}

export default Inicio;