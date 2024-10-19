const oracledb = require('oracledb');
const { getConnection } = require('../db/connection');

// Función para obtener las ventas mensuales
const obtenerVentasMensuales = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();

    const { fechaInicio, fechaFin } = req.query;

    // Prepara los parámetros condicionalmente, solo pasa las fechas si existen
    const params = {
      total_ventas: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };
    
    if (fechaInicio) {
      params.p_FechaInicio = new Date(fechaInicio);
    }

    if (fechaFin) {
      params.p_FechaFin = new Date(fechaFin);
    }

    const result = await connection.execute(
      `BEGIN ObtenerVentasMensuales(:p_FechaInicio, :p_FechaFin, :total_ventas); END;`,
      params
    );

    res.json({ totalVentas: result.outBinds.total_ventas });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error retrieving data');
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

  
// Función para obtener los productos más vendidos
const obtenerTopProductos = async (req, res) => {
  let connection;
  try {
    const { fechaInicio, fechaFin } = req.query; // Recibe las fechas desde el frontend
    connection = await getConnection();
    const result = await connection.execute(
      `BEGIN ObtenerTopProductos(:p_FechaInicio, :p_FechaFin, :cursor_resultado); END;`,
      {
        p_FechaInicio: fechaInicio ? new Date(fechaInicio) : null,
        p_FechaFin: fechaFin ? new Date(fechaFin) : null,
        cursor_resultado: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
      }
    );

    const resultSet = result.outBinds.cursor_resultado;
    const rows = [];
    let row;

    while ((row = await resultSet.getRow())) {
      rows.push(row);
    }
    await resultSet.close();
    
    res.json(rows);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error retrieving data');
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

// Función para obtener los productos menos vendidos
const obtenerProductosMenosVendidos = async (req, res) => {
  let connection;
  try {
    const { fechaInicio, fechaFin } = req.query; // Recibe las fechas desde el frontend
    connection = await getConnection();
    const result = await connection.execute(
      `BEGIN ObtenerProductosMenosVendidos(:p_FechaInicio, :p_FechaFin, :cursor_resultado); END;`,
      {
        p_FechaInicio: fechaInicio ? new Date(fechaInicio) : null,
        p_FechaFin: fechaFin ? new Date(fechaFin) : null,
        cursor_resultado: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
      }
    );

    const resultSet = result.outBinds.cursor_resultado;
    const rows = [];
    let row;

    while ((row = await resultSet.getRow())) {
      rows.push(row);
    }
    await resultSet.close();
    
    res.json(rows);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error retrieving data');
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

// Exportar las funciones
module.exports = {
  obtenerVentasMensuales,
  obtenerTopProductos,
  obtenerProductosMenosVendidos,
};
