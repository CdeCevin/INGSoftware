
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
        const rows = [];
        let row;

        while ((row = await resultSet.getRow())) {
            rows.push(row);
        }
        await resultSet.close();
        
        res.json(rows);
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
  
