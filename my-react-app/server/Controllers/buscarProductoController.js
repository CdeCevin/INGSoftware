const oracledb = require('oracledb');
const { getConnection } = require('../db/connection'); // Asegúrate de que esta ruta sea correcta

const buscarProducto = async (req, res) => {
    // Obtener datos del cuerpo de la solicitud y asignar null si no se especifican
    const { 'input-nombre': nombre = null, 'input-color': color = null } = req.body; 
    console.log('Nombre:', nombre); // Log para depuración
    console.log('Color:', color); // Log para depuración

    let connection;
    try {
        connection = await getConnection();
        const cursor = await connection.execute(
            `BEGIN Outlet_FiltrarProducto(:p_PalabraClave, :p_colorp, :c_Productos); END;`,
            {
                p_PalabraClave: nombre,
                p_colorp: color,
                c_Productos: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
            }
        );

        const resultCursor = cursor.outBinds.c_Productos;
        const result = await connection.execute(resultCursor, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        res.status(200).json({ message: 'Búsqueda exitosa', data: result.rows });
    } catch (err) {
        console.error('Error en la búsqueda de productos:', err);
        res.status(500).json({ message: 'Error al buscar el producto.' });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

module.exports = { buscarProducto };
