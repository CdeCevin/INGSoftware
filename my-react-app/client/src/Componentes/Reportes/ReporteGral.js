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
    const fechaInicioParam = fechaInicio === '' ? null : fechaInicio;
    const fechaFinParam = fechaFin === '' ? null : fechaFin;

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

  const handleBuscar = (event) => {
    event.preventDefault();
    obtenerReportes();
  };

 useEffect(() => {
      obtenerReportes(); // Llamar a obtenerReportes cuando el componente se monte
      document.title = 'Reporte';
    }, []);

  return (
      <div className="main-block">
        <form onSubmit={handleBuscar} encType="multipart/form-data">
          <h1>Reporte de Ventas</h1>
          <fieldset>
            <legend>
              <h3>Ventas Totales</h3>
            </legend>
            <div className="account-details" style={{ display: 'flex', justifyContent: 'space-between',alignItems: 'center' }}>
              <div style={{ flex: '1', display: 'flex', alignItems: 'center',marginLeft: '50px'  }}>
              <h2>${ventasMensuales !== null ? ventasMensuales : 'Cargando...'}</h2>
              </div>
              <div style={{ flex: '1', display: 'flex', alignItems: 'center',marginTop: '20px' }}>
                <label>Desde</label>
                <input 
                  type="date" 
                  value={fechaInicio} 
                  onChange={(e) => setFechaInicio(e.target.value)} 
                />
              </div>
              <div style={{ flex: '1', display: 'flex', alignItems: 'center',marginTop: '20px' }}>
                <label>Hasta</label>
                <input 
                  type="date" 
                  value={fechaFin} 
                  onChange={(e) => setFechaFin(e.target.value)} 
                />
              </div>
            
            <div style={{ flex: '1', display: 'flex', alignItems: 'center',marginTop: '13px', marginLeft: '10px' }}>
            <button onClick={handleBuscar} style={{ width:'50px', padding: '5px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', margin:'0px' }}><i className="fa fa-search"></i></button>
            </div>
            </div>
          </fieldset>
        </form>

      
        {/*<h2>Ventas Mensuales: {ventasMensuales !== null ? ventasMensuales : 'Cargando...'}</h2>*/}
          <fieldset>
          <legend>
          <h3>Top Productos</h3>
          </legend>
          <div>
            <table class="tabla-productos">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Total Ventas</th>
                </tr>
              </thead>
              <tbody>
                {topProductos.map((producto, index) => (
                  <tr key={index}>
                    <td>{producto[0]}</td>
                    <td>{producto[1]}</td>
                    <td>${producto[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </fieldset> 

         <fieldset> 
         <legend>
          <h3>Productos Menos Vendidos</h3>
          </legend>
          <div>
            <table class="tabla-productos">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Total Ventas</th>
                </tr>
              </thead>
              <tbody>
                {menosVendidos.map((producto, index) => (
                  <tr key={index}>
                    <td>{producto[0]}</td>
                    <td>{producto[1]}</td>
                    <td>${producto[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </fieldset> 
      </div>
  );
}

export default ReporteGral;
