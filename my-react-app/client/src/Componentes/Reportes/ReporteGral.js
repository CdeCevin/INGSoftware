import React, { useEffect, useState } from 'react';

function ReporteGral() {
  const [ventasMensuales, setVentasMensuales] = useState(null);
  const [topProductos, setTopProductos] = useState([]);
  const [menosVendidos, setMenosVendidos] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const obtenerReportes = async () => {
    // Obtener ventas mensuales con intervalo de tiempo si existe
    const responseVentas = await fetch(`http://localhost:3001/api/reportes/ventas-mensuales?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
    const dataVentas = await responseVentas.json();
    setVentasMensuales(dataVentas.totalVentas);

    // Obtener top productos
    const responseTop = await fetch(`http://localhost:3001/api/reportes/top-productos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
    const dataTop = await responseTop.json();
    setTopProductos(dataTop);

    // Obtener productos menos vendidos
    const responseMenos = await fetch(`http://localhost:3001/api/reportes/menos-vendidos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
    const dataMenos = await responseMenos.json();
    setMenosVendidos(dataMenos);
  };

  const handleBuscar = () => {
    obtenerReportes();
  };

  return (
    <div>
      <h1>Reporte General</h1>

      <div>
        <label>Fecha Inicio:</label>
        <input 
          type="date" 
          value={fechaInicio} 
          onChange={(e) => setFechaInicio(e.target.value)} 
        />
        <label>Fecha Fin:</label>
        <input 
          type="date" 
          value={fechaFin} 
          onChange={(e) => setFechaFin(e.target.value)} 
        />
        <button onClick={handleBuscar}>Buscar Reportes</button>
      </div>

      <h2>Ventas Mensuales: {ventasMensuales !== null ? ventasMensuales : 'Cargando...'}</h2>

      <h3>Top Productos</h3>
      <ul>
        {topProductos.map((producto, index) => (
          <li key={index}>
            <strong>Producto:</strong> {producto[0]} <br />
            <strong>Cantidad Vendida:</strong> {producto[1]} <br />
            <strong>Precio:</strong> ${producto[2]}
          </li>
        ))}
      </ul>

      <h3>Productos Menos Vendidos</h3>
      <ul>
        {menosVendidos.map((producto, index) => (
          <li key={index}>
            <strong>Producto:</strong> {producto[0]} <br />
            <strong>Cantidad Vendida:</strong> {producto[1]} <br />
            <strong>Precio:</strong> ${producto[2]}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReporteGral;
