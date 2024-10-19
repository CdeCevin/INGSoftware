import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListadoProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener los productos activos desde el backend
  const obtenerProductos = async () => {
    try {
      const respuesta = await axios.get('http://localhost:3001/api/productos/activos');
      setProductos(respuesta.data);
      setLoading(false);
    } catch (err) {
      console.error('Error al obtener los productos:', err);
      setError('Hubo un error al cargar los productos.');
      setLoading(false);
    }
  };

  // Se ejecuta cuando el componente se monta
  useEffect(() => {
    obtenerProductos();
  }, []);

  // Renderizar la tabla de productos
  return (
    <div>
      <h2>Listado de Productos Activos</h2>
      {loading && <p>Cargando productos...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && productos.length === 0 && <p>No hay productos activos.</p>}
      
      {productos.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Stock</th>
              <th>Precio Unitario</th>
              <th>Color</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.CODIGO_PRODUCTO}>
                <td>{producto.CODIGO_PRODUCTO}</td>
                <td>{producto.NOMBRE_PRODUCTO}</td>
                <td>{producto.TIPO_PRODUCTO}</td>
                <td>{producto.STOCK}</td>
                <td>{producto.PRECIO_UNITARIO}</td>
                <td>{producto.COLOR_PRODUCTO}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListadoProductos;
