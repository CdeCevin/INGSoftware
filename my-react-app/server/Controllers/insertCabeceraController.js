const oracledb = require('oracledb');
const { getConnection } = require('../db/connection');

const insertCabecera = async (req, res) => {
    
    let connection; 
    try {
        const { codigo, currentUserRut } = req.body;
        console.log('Datos recibidos:', { codigo, currentUserRut });        
        connection = await getConnection();

        await connection.execute(
            `BEGIN OUTLET_Insert_Cabecera(:c_Clientes, c_rut);END;`,
            { c_Clientes: codigo, c_rut: currentUserRut}
        );
        
        const codigoResult = await connection.execute(
            `SELECT last_number FROM user_sequences WHERE sequence_name = 'SEC_COD_CABECERA'`
        );
        const codigoCabecera = codigoResult.rows[0][0] - 1; 

        await connection.execute(
            'BEGIN RegistrarVentaPendiente(:cod); END;', 
            { cod: { val: codigoCabecera, dir: oracledb.BIND_IN } }
        );

        await connection.commit();
        
        res.status(200).json({ 
            message: 'Cabecera insertada y venta pendiente registrada', 
            data: codigo, 
            codigoCabeceraGenerado: codigoCabecera 
        });

    } catch (err) {
        console.error('Error en el proceso:', err);
        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackErr) {
                console.error('Error al intentar hacer rollback:', rollbackErr);
            }
        }
        res.status(500).json({ message: 'Error al procesar la solicitud.' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeErr) {
                console.error('Error al cerrar la conexión:', closeErr);
            }
        }
    }
};

module.exports = { insertCabecera };