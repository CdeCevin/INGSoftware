const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  user: 'Cevin',
  password: '213233963Y',
  connectString: 'localhost:1521/XE',
};

// Endpoint para obtener ventas mensuales
app.get('/api/ventas-mensuales', async (req, res) => {
  let connection;
  try {
    // Intentar conectar a la base de datos
    connection = await oracledb.getConnection(dbConfig);
    console.log("Connected to the database");

    // Ejecutar el procedimiento almacenado para obtener ventas mensuales
    const result = await connection.execute(
      `BEGIN ObtenerVentasMensuales(:p_Anio, :p_Mes, :total_ventas); END;`,
      {
        p_Anio: new Date().getFullYear(),  // Año actual
        p_Mes: new Date().getMonth() + 1,  // Mes actual (de 0 a 11, por eso sumamos 1)
        total_ventas: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }  // Salida para las ventas totales
      }
    );

    // Verificar si se obtuvo un valor correcto
    console.log("Total ventas:", result.outBinds.total_ventas); // Imprimir el valor de ventas totales en consola
    res.json({ totalVentas: result.outBinds.total_ventas });    // Enviar respuesta al cliente
  } catch (err) {
    console.error("Error connecting to the database or retrieving data:", err);
    res.status(500).send('Error retrieving data');
  } finally {
    if (connection) {
      await connection.close();  // Cerrar la conexión
      console.log("Connection closed");
    }
  }
});

// Endpoint para obtener los productos más vendidos
app.get('/api/top-productos', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    console.log("Connected to the database");

    const result = await connection.execute(
      `BEGIN ObtenerTopProductos(:cursor_resultado); END;`,
      { cursor_resultado: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } }
    );
    
    const resultSet = result.outBinds.cursor_resultado;
    const rows = [];
    let row;
    while ((row = await resultSet.getRow())) {
      rows.push(row);
    }

    console.log("Top productos obtenidos:", rows); // Imprimir los productos más vendidos
    res.json(rows);
  } catch (err) {
    console.error("Error retrieving top products:", err);
    res.status(500).send('Error retrieving data');
  } finally {
    if (connection) {
      await connection.close();
      console.log("Connection closed");
    }
  }
});

// Endpoint para obtener los productos menos vendidos
app.get('/api/menos-vendidos', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    console.log("Connected to the database");

    const result = await connection.execute(
      `BEGIN ObtenerProductosMenosVendidos(:cursor_resultado); END;`,
      { cursor_resultado: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } }
    );

    const resultSet = result.outBinds.cursor_resultado;
    const rows = [];
    let row;
    while ((row = await resultSet.getRow())) {
      rows.push(row);
    }

    console.log("Productos menos vendidos obtenidos:", rows); // Imprimir los productos menos vendidos
    res.json(rows);
  } catch (err) {
    console.error("Error retrieving least sold products:", err);
    res.status(500).send('Error retrieving data');
  } finally {
    if (connection) {
      await connection.close();
      console.log("Connection closed");
    }
  }
});

// Iniciar el servidor en el puerto 3001
const port = 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
