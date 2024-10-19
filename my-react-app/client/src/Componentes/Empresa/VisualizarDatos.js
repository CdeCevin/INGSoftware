import React, { useState, useEffect } from 'react';

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

  return (
    <div>
      <h1>Información de la Empresa</h1>
      <p><strong>Nombre:</strong> {datos.nombre}</p>
      <p><strong>Dirección:</strong> {datos.nombreCalle} {datos.numeroDireccion}, {datos.nombreCiudad}, {datos.nombreRegion}</p>
      <p><strong>Teléfono:</strong> {datos.telefono}</p>
    
    </div>
  );
};

export default VisualizarDatos;
