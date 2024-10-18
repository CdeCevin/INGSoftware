const oracledb = require('oracledb');
const { getConnection } = require('../db/connection');


async function obtenerReporteVentas(req, res) {
  let connection;
  try {
    connection = await getConnection();
    
    // Consultar cabecera de ventas
    const queryCabecera = `
      SELECT OC.Codigo_Comprobante_Pago, OC.Fecha, OC.Codigo_Cliente,
             CL.Nombre_Cliente, CL.Codigo_Direccion
      FROM Outlet_Cabecera_Comprobante_Pago OC 
      JOIN Outlet_Cliente CL ON OC.CODIGO_CLIENTE = CL.CODIGO_CLIENTE`;
    
    const resultCabecera = await connection.execute(queryCabecera);
    const ventas = [];

    for (const row of resultCabecera.rows) {
      const p_CodigoDireccion = row[4];
      
      // Obtener detalles de dirección
      const queryDireccion = `
        BEGIN ObtenerDireccion(:p_CodigoDireccion, :o_NombreCalle, :o_NumeroDireccion, :o_NombreCiudad, :o_NombreRegion); END;`;

      const resultDireccion = await connection.execute(queryDireccion, {
        p_CodigoDireccion,
        o_NombreCalle: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        o_NumeroDireccion: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        o_NombreCiudad: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        o_NombreRegion: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      });
      

      const direccion = `${resultDireccion.outBinds.o_NombreCalle} ${resultDireccion.outBinds.o_NumeroDireccion}, ${resultDireccion.outBinds.o_NombreCiudad}, ${resultDireccion.outBinds.o_NombreRegion}`;

      // Obtener productos
      const queryProductos = `
        SELECT M.Nombre_Producto, M.Color_Producto, C.Cantidad, C.Precio_Total
        FROM Outlet_Cuerpo_Comprobante_Pago C
        JOIN OUTLET_Producto M ON C.Codigo_Producto = M.Codigo_Producto
        WHERE C.Codigo_Comprobante_Pago = :CodigoComprobante`;
        
      const resultProductos = await connection.execute(queryProductos, { CodigoComprobante: row[0] });

      let precioTotal = 0;
      const productos = [];

      for (const prod of resultProductos.rows) {
        productos.push(`${prod[0]} (${prod[2]} ${prod[1]})`); 
        precioTotal += prod[3];
      }

      ventas.push({
        codigoComprobante: row[0],
        fecha: row[1],
        nombreCliente: row[3],
        direccionCalle: resultDireccion.outBinds.o_NombreCalle,
        numeroDireccion: resultDireccion.outBinds.o_NumeroDireccion,
        ciudad: resultDireccion.outBinds.o_NombreCiudad,
        region: resultDireccion.outBinds.o_NombreRegion,
        productos,
        precioTotal
      });      
    }

    res.json(ventas);
  } catch (err) {
    console.error('Error al obtener el reporte de ventas:', err);
    res.status(500).send('Error al obtener los datos');
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

module.exports = {
  obtenerReporteVentas
};
