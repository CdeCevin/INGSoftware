const oracledb = require('oracledb');
const dbConfig = require('../bd/connection');  // Aquí importas la conexión a la BD

// Controlador para obtener productos activos
const obtenerProductosActivos = async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `BEGIN
         Outlet_ObtenerProductosActivos(:cursor);
       END;`,
      {
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
      }
    );

    const resultSet = result.outBinds.cursor;
    const productos = [];

    let row;
    while ((row = await resultSet.getRow())) {
      productos.push({
        Codigo_Producto: row[0],
        Activo: row[1],
        Stock: row[2],
        Precio_Unitario: row[3],
        Nombre_Producto: row[4],
        Tipo_Producto: row[5],
        Color_Producto: row[6],
      });
    }

    await resultSet.close();
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los productos.");
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

module.exports = {
  obtenerProductosActivos
};
