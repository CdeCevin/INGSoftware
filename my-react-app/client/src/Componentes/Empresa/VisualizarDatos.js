import React, { useState, useEffect } from 'react';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';

const VisualizarDatos = () => {
  const [datos, setDatos] = useState({
    telefono: '',
    nombre: '',
    nombreCalle: '',
    numeroDireccion: '',
    nombreCiudad: '',
    nombreRegion: '',
  });

  useEffect(() => {
    const obtenerDatosCliente = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/datosEmpresa')
        const data = await response.json();
        console.log("Datos fronted", data);
        setDatos({
          telefono: data.telefono,
          nombre: data.nombre,
          nombreCalle: data.nombreCalle,
          numeroDireccion: data.numeroDireccion,
          nombreCiudad: data.nombreCiudad,
          nombreRegion: data.nombreRegion
        }); 
      } catch (error) {
        console.error('Error al obtener los datos del cliente:', error);
      }
    };

    obtenerDatosCliente();
  }, []);

  useEffect(() => {
    document.title = 'Datos Empresa';
}, []);

  return (
    <div className="main-block">
      <h1>Datos Empresa</h1>
      
      <fieldset>
          <div class="w3-container2">
          <p style={{color: '#637e74', fontSize: '18px',paddingLeft: '10px',paddingTop: '10px'}}><strong>Nombre:</strong> <span style={{color: '#666'}}>{datos.nombre}</span></p>
          <p style={{color: '#637e74', fontSize: '18px',paddingLeft: '10px',paddingTop: '10px'}}><strong>Dirección:</strong> <span style={{color: '#666'}}> {datos.nombreCalle} {datos.numeroDireccion}, {datos.nombreCiudad}, {datos.nombreRegion}</span></p>
          <p style={{color: '#637e74', fontSize: '18px',paddingLeft: '10px',paddingTop: '10px'}}><strong>Teléfono:</strong>  <span style={{color: '#666'}}>{datos.telefono}</span></p>          
          </div>
      </fieldset> 
    </div>

  );
};

export default VisualizarDatos;
