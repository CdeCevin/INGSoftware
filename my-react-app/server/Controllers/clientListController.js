const oracledb = require('oracledb');
const connection = require('../db/connection'); // Importa tu conexión

// Función para obtener la lista de clientes
const getClients = async (req, res) => {
    let conn;
    try {
        // Obtener conexión de la base de datos
        conn = await connection.getConnection();

        // Preparar y ejecutar el procedimiento almacenado
        const result = await conn.execute(
            `BEGIN 
                Outlet_FiltrarCliente(:c_Clientes); 
            END;`,
            {
                c_Clientes: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
            }
        );

        // Obtener el cursor de resultados
        const cursor = result.outBinds.c_Clientes;

        // Obtener todas las filas del cursor
        const clients = await cursor.getRows();

        // Cerrar el cursor
        await cursor.close();

        // Devolver los clientes en formato JSON

        res.json(clients);
    } catch (err) {
        console.error('Error al obtener la lista de clientes:', err);
        res.status(500).send('Error al obtener la lista de clientes');
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
module.exports = { getClients };
