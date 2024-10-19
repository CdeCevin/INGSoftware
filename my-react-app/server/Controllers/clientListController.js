const oracledb = require('oracledb');
const connection = require('../db/connection'); // Importa tu conexión

// Función para obtener la lista de productos activos
const getActiveProducts = async (req, res) => {
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
module.exports = { getActiveProducts };
