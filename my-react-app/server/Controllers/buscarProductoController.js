// Controllers/ProductoController.js
const { getConnection } = require('../db/connection'); // Asegúrate de que esta ruta sea correcta

const buscarProducto = async (req, res) => {
    const { 'input-nombre': nombre, 'input-color': color } = req.body; // Obtener datos del cuerpo de la solicitud

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
        const result = await connection.execute(resultCursor);

        // Aquí deberías procesar los resultados y devolver una respuesta
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
