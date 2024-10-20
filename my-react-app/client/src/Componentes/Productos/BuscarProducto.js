import React, { useState } from 'react';
import axios from 'axios';

const BuscarProducto = () => {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [color, setColor] = useState('');

  const buscarProductos = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/buscarProducto', {
        'input-nombre': nombre,
        'input-color': color,
      });
      setProductos(response.data.data);
    } catch (error) {
      console.error('Error al buscar productos:', error);
    }
  };

  return (
    <div className="main-content">
      <h3>Resultados</h3>
      <input
        type="text"
        placeholder="Nombre del producto"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        type="text"
        placeholder="Color del producto"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <button onClick={buscarProductos}>Buscar</button>

      {productos.length > 0 ? (
        <table className="venta-table">
          <thead>
            <tr>
              <th>CÓDIGO</th>
              <th>STOCK</th>
              <th>PRECIO</th>
              <th>NOMBRE</th>
              <th>COLOR</th>
              <th>FOTO</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto, index) => (
              <tr key={index}>
                <td>{producto.codigo_producto}</td>
                <td>{producto.stock}</td>
                <td>{producto.precio_unitario}</td>
                <td>{producto.nombre_producto}</td>
                <td>{producto.color_producto}</td>
                <td>
                  <form action={`/pagina_foto_producto/${producto.codigo_producto}`} method="get">
                    <button type="submit">Ver foto</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No se encontraron productos.</p>
      )}
    </div>
  );
};

export default BuscarProducto;
