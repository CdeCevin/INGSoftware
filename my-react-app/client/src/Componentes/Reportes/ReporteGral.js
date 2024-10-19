import React, { useEffect, useState } from 'react';
import '../../Estilos/style_menu.css';
import '../../Estilos/estilo.css';

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

  useEffect(() => {
    document.title = 'Reporte';
}, []);

  return (
    <div style={{ marginLeft: '12%' }}>
      <div className="main-block">
        <form onSubmit={handleBuscar} encType="multipart/form-data">
          <h1>Reporte General</h1>
          <fieldset>
            <legend>
              <h3>Ventas Totales</h3>
            </legend>
            <div className="account-details" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ flex: '1' }}>
              <h2>{ventasMensuales !== null ? ventasMensuales : 'Cargando...'}</h2>
              </div>
              <div style={{ flex: '1' }}>
                <label>Desde</label>
                <input 
                  type="date" 
                  value={fechaInicio} 
                  onChange={(e) => setFechaInicio(e.target.value)} 
                />
              </div>
              <div style={{ flex: '1'}}>
                <label>Hasta</label>
                <input 
                  type="date" 
                  value={fechaFin} 
                  onChange={(e) => setFechaFin(e.target.value)} 
                />
              </div>
            
            <div style={{ flex: '1' , alignSelf: 'center'}} >
            <button onClick={handleBuscar} style={{ width:'50px', padding: '5px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa fa-search"></i></button>
            </div>
            </div>
          </fieldset>
        </form>

      
        {/*<h2>Ventas Mensuales: {ventasMensuales !== null ? ventasMensuales : 'Cargando...'}</h2>*/}
        <fieldset>
        <legend>
        <h3>Top Productos</h3>
        </legend>
        <ul>
          {topProductos.map((producto, index) => (
            <li key={index}>
              <strong>Producto:</strong> {producto[0]} <br />
              <strong>Cantidad Vendida:</strong> {producto[1]} <br />
              <strong>Precio:</strong> ${producto[2]}
            </li>
          ))}
        </ul>
        </fieldset> 

         <fieldset> 
         <legend>
        <h3>Productos Menos Vendidos</h3>
        </legend>
        <ul>
          {menosVendidos.map((producto, index) => (
            <li key={index}>
              <strong>Producto:</strong> {producto[0]} <br />
              <strong>Cantidad Vendida:</strong> {producto[1]} <br />
              <strong>Precio:</strong> ${producto[2]}
            </li>
          ))}
        </ul>
        </fieldset> 
      </div>
    </div>
  );
}

export default ReporteGral;
