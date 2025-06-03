CdeCevin/INGSoftware
my-react-app/server/Controllers/eliminarProductoController.js

const oracledb = require('oracledb');
const { getConnection } = require('../db/connection'); // Importa correctamente
const eliminarProducto = async (req, res) => {
  let connection;
  try {
    const { codigo } = req.body;

    // Verifica que el código no sea indefinido
    console.log('Código recibido desde el frontend:', codigo);
    
    // Establece la conexión
    connection = await getConnection(); // Llama a la función de conexión

    // Ejecuta el procedimiento almacenado
    await connection.execute(
      `BEGIN OUTLET_Elim_Producto(:p_codigo); END;`,
      {
        p_codigo: parseInt(codigo) // Asegúrate de que el código sea un número
      }
    );

    await connection.commit();

    res.status(200).json({ message: 'Producto eliminado correctamente.' });
  } catch (err) {
    console.error('Error al eliminar producto:', err);
    res.status(500).json({ message: 'Error al eliminar el producto.' });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

module.exports = { eliminarProducto };

CdeCevin/INGSoftware
my-react-app/server/Controllers/IngresarProductoController.js


    let connection;

    try {
        connection = await getConnection(); // Usa la conexión de tu archivo db/connection.js
        
        const query = `
            BEGIN 
                OUTLET_Insert_Producto(:codigo, :stock, :precio, :nombre, :color, :tipo, :stockmin); 
            END;
        `;

        await connection.execute(query, {
            codigo: Number(codigo),
            stock: Number(stock),
            precio: Number(precio),
            nombre: nombre,
            color: color,
            tipo: tipo,
            stockmin: Number(stockmin)
        });

        await connection.commit();
        res.status(200).json({ message: 'Producto añadido correctamente' });


CdeCevin/INGSoftware
my-react-app/server/Controllers/productListController.js


const connection = require('../db/connection'); // Importa tu conexión

// Función para obtener la lista de productos activos
const getProducts = async (req, res) => {
    let conn;
    try {
        // Obtener conexión de la base de datos
        conn = await connection.getConnection();

        // Preparar y ejecutar el procedimiento almacenado
        const result = await conn.execute(
            `BEGIN 
                Outlet_ObtenerProductosActivos(:c_Productos); 
            END;`,
            {
                c_Productos: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
            }
        );

        // Obtener el cursor de resultados
        const cursor = result.outBinds.c_Productos;

        // Obtener todas las filas del cursor
        const products = await cursor.getRows();

        // Cerrar el cursor
        await cursor.close();

        // Devolver los productos en formato JSON
        console.log(products);
        res.json(products);
    } catch (err) {
        console.error('Error al obtener la lista de productos:', err);
        res.status(500).send('Error al obtener la lista de productos');
    } finally {
        if (conn) {
            try {
                // Cerrar la conexión
                await conn.close();
            } catch (err) {
                console.error('Error al cerrar la conexión:', err);
            }
        }
    }
};

// Exportar la función para ser usada en otras partes del código
module.exports = { getProducts };

