const oracledb = require('oracledb');
const {getConnection} = require('../bd/connection');

// Controlador para obtener la lista de productos activos
async function getProductList(req, res) {
  let connection;

  try {
    connection = await getConnection();

    // Llamada al procedimiento almacenado para obtener productos activos
    const result = await connection.execute(
      `BEGIN 
         Outlet_ObtenerProductosActivos(:c_Productos); 
       END;`,
      {
        c_Productos: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
      }
    );

    const resultSet = result.outBinds.c_Productos;
    let productos = [];
    let row;

    // Leer todas las filas del cursor
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

    // Enviar los productos como respuesta
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los productos');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error(error);
      }
    }
  }
}

module.exports = { getProductList };
