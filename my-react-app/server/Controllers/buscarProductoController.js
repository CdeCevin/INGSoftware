const oracledb = require('oracledb');
const { getConnection } = require('../db/connection'); // Asegúrate de que esta ruta sea correcta

const buscarProducto = async (req, res) => {
    const { 'input-nombre': nombre, 'input-color': color } = req.body;

    // Asignar null si no hay valor
    const palabraClave = nombre && nombre.trim() ? nombre.trim() : '';
    const colorParam = color && color.trim() ? color.trim() : '';

    console.log('Nombre:', palabraClave);
    console.log('Color:', colorParam);

    let connection;
    try {
        connection = await getConnection();
        const cursor = await connection.execute(
            `BEGIN Outlet_FiltrarProducto(:p_PalabraClave, :p_colorp, :c_Productos); END;`,
            {
                p_PalabraClave: palabraClave,
                p_colorp: colorParam,
                c_Productos: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
            }
        );

        const resultCursor = cursor.outBinds.c_Productos;
        const result = await connection.execute(resultCursor);

        // Procesar resultados
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
