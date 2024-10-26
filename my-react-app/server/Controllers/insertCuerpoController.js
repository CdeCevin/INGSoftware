const oracledb = require('oracledb');
const { getConnection } = require('../db/connection');

// Búsqueda de productos con filtro
const buscarProductos = async (req, res) => {
    let connection;
    try {
        const { codigo, color } = req.query; // parámetros de búsqueda
        connection = await getConnection();

        const cursor = await connection.execute(
            `BEGIN Outlet_FiltrarProducto(:p_PalabraClave, :p_colorp, :c_Productos); END;`,
            {
                p_PalabraClave: codigo,
                p_colorp: color,
                c_Productos: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
            }
        );

        const result = await cursor.outBinds.c_Productos.getRows();
        res.status(200).json({ productos: result });
    } catch (error) {
        console.error('Error al buscar productos:', error);
        res.status(500).json({ message: 'Error al buscar productos.' });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

module.exports = { buscarProductos};
