const oracledb = require('oracledb');
const { getConnection } = require('../db/connection');

const insertCliente = async (req, res) => {
    const { INnombre, INtelefono, INregion, INciudad, INcalle, INnumero } = req.body;
    console.log(INnombre, INtelefono, INregion, INciudad, INcalle, INnumero);

    let connection;
    try {
        connection = await getConnection();

        // 1. Call stored procedure to insert client
        console.log("Starting client insertion procedure...");
        await connection.execute(
            `BEGIN OUTLET_Insert_Client(:calle, :numero, :ciudad, :nombre, :telefono); END;`,
            {
                calle: INcalle,
                numero: INnumero,
                ciudad: INciudad,
                nombre: INnombre,
                telefono: Number(INtelefono)
            }
        );
        // 2. Get the last number from the `SEC_COD_CLIENTES` sequence
        const resultCodigo = await connection.execute(
            `SELECT last_number FROM user_sequences WHERE sequence_name = 'SEC_COD_CLIENTES'`
        );
        const codigoCliente = resultCodigo.rows[0][0] - 1; // Assuming -1 to get the actual ID used
        console.log("Client ID obtained:", codigoCliente);

        // 3. Call procedure to insert into cabecera using the client code
        await connection.execute(
            `BEGIN OUTLET_Insert_Cabecera(:cod); END;`,
            { cod: codigoCliente }
        );

        // 4. Get the last number from the `SEC_COD_CABECERA` sequence (for the newly inserted cabecera)
        const codigoResult = await connection.execute(
            `SELECT last_number FROM user_sequences WHERE sequence_name = 'SEC_COD_CABECERA'`
        );
        const codigoCabecera = codigoResult.rows[0][0] - 1; // Assuming -1 to get the actual ID used

        // 5. Register the pending sale for the cabecera
        await connection.execute(
            'BEGIN RegistrarVentaPendiente(:cod); END;', 
            { cod: { val: codigoCabecera, dir: oracledb.BIND_IN } }
        );

        // Commit all changes in a single transaction if all operations succeed
        await connection.commit();
        console.log('Transaction committed successfully for client and cabecera.');

        res.status(200).json({ 
            message: 'Cliente y cabecera agregados exitosamente.',
            codigoCliente: codigoCliente,
            codigoCabecera: codigoCabecera
        });

    } catch (error) {
        console.error('Error al ingresar el cliente o sus datos asociados:', error);
        // Rollback any changes if an error occurs
        if (connection) {
            try {
                await connection.rollback();
                console.log('Transaction rolled back due to an error.');
            } catch (rollbackErr) {
                console.error('Error attempting rollback:', rollbackErr);
            }
        }
        res.status(500).json({ message: 'Error interno del servidor al procesar la solicitud.' });
    } finally {
        // Always close the connection
        if (connection) {
            try {
                await connection.close();
                console.log('Database connection closed.');
            } catch (err) {
                console.error('Error closing the connection:', err);
            }
        }
    }
};

module.exports = { insertCliente };