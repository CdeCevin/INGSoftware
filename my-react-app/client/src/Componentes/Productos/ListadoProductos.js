import React, { useState, useEffect } from 'react';

const ListadoProductos = () => {
  const [productos, setProductos] = useState([]); // Estado para almacenar los productos
  const [loading, setLoading] = useState(true);  // Estado para mostrar si está cargando
  const [error, setError] = useState(null);      // Estado para manejar errores

  // Función para obtener los productos desde el backend
  const fetchProductos = async () => {
    try {
      const response = await fetch('/api/productos'); // Llama al endpoint del backend
      if (!response.ok) {
        throw new Error('Error al obtener los productos');
      }
      const data = await response.json(); // Convierte la respuesta a JSON
      setProductos(data);                 // Actualiza el estado con los productos
    } catch (err) {
      setError(err.message);              // Si ocurre un error, lo guarda en el estado
    } finally {
      setLoading(false);                  // Finaliza el estado de carga
    }
  };

  // Hook useEffect para cargar los productos al montar el componente
  useEffect(() => {
    fetchProductos();
  }, []);

  // Muestra un mensaje de carga mientras los datos se obtienen
  if (loading) {
    return <div>Cargando productos...</div>;
  }

  // Si hay un error, se muestra en la interfaz
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Listado de Productos</h1>
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Color</th>
            <th>Precio Unitario</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.Codigo_Producto}>
              <td>{producto.Codigo_Producto}</td>
              <td>{producto.Nombre_Producto}</td>
              <td>{producto.Tipo_Producto}</td>
              <td>{producto.Color_Producto}</td>
              <td>{producto.Precio_Unitario}</td>
              <td>{producto.Stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListadoProductos;
