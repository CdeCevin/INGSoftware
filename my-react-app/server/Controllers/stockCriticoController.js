
const oracledb = require('oracledb');
const { getConnection } = require('../db/connection');

const obtenerProductosBajoStock = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const result = await connection.execute(
            `BEGIN ObtenerProductosBajoStock(:cursor_resultado); END;`,
            {
                cursor_resultado: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
            }
        );
        const resultSet = result.outBinds.cursor_resultado;
        const products = await resultSet.getRows();
        await resultSet.close();
        console.log(products);
        res.json(products);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error retrieving data');
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

module.exports = {
    obtenerProductosBajoStock
};
  
