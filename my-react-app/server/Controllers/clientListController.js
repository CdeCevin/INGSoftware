const oracledb = require('oracledb');
const connection = require('../db/connection'); // Importa tu conexión

// Función para obtener la lista de clientes con dirección completa
const getClients = async (req, res) => {
    let conn;
    try {
        // Obtener conexión de la base de datos
        conn = await connection.getConnection();

        // Ejecutar el procedimiento almacenado para obtener el cursor con los clientes
        const result = await conn.execute(
            `BEGIN 
                Outlet_FiltrarCliente(:c_Clientes); 
            END;`,
            {
                c_Clientes: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
            }
        );

        // Obtener el cursor y todas las filas
        const cursor = result.outBinds.c_Clientes;
        const clientes = await cursor.getRows();
        await cursor.close();

        // Procesar cada cliente para obtener información completa
        const clientesConDireccion = [];
        for (const cliente of clientes) {
            const codigo = cliente[0]; // Código del cliente
            const infoResult = await conn.execute(
                `BEGIN 
                    ObtenerInformacionCliente(
                        :p_cod, :p_Activo, :o_Telefono, :o_Nombres, 
                        :o_NombreCalle, :o_NumeroDireccion, 
                        :o_NombreCiudad, :o_NombreRegion
                    ); 
                END;`,
                {
                    p_cod: codigo,
                    p_Activo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                    o_Telefono: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 255 },
                    o_Nombres: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 255 },
                    o_NombreCalle: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 255 },
                    o_NumeroDireccion: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 255 },
                    o_NombreCiudad: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 255 },
                    o_NombreRegion: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 255 }
                }
            );

            // Construir la dirección completa y agregarla al cliente
            const direccion = `${infoResult.outBinds.o_NombreCalle} ${infoResult.outBinds.o_NumeroDireccion}, ${infoResult.outBinds.o_NombreCiudad}, ${infoResult.outBinds.o_NombreRegion}`;
            clientesConDireccion.push({
                codigo,
                telefono: infoResult.outBinds.o_Telefono,
                nombre: infoResult.outBinds.o_Nombres,
                direccion
            });
        }

        // Enviar la respuesta en formato JSON
        res.json(clientesConDireccion);
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

module.exports = { getClients };
