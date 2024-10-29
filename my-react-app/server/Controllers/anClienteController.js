const oracledb = require('oracledb');
const { getConnection } = require('../db/connection');

const insertCliente = async (req, res) => {
    const { INnombre, INtelefono, INregion, INciudad, INcalle, INnumero } = req.body;
    console.log(INnombre, INtelefono, INregion, INciudad, INcalle, INnumero);
    
    let connection;
    try {
        connection = await getConnection();

        // 1. Llamar al procedimiento almacenado para insertar cliente
        console.log("primer procedimiento");
        const result = await connection.execute(
            `BEGIN OUTLET_Insert_Client(:calle, :numero, :ciudad, :nombre, :telefono); END;`,
            {
                calle: INcalle,
                numero: INnumero,
                ciudad: INciudad,
                nombre: INnombre,
                telefono: Number(INtelefono)
            }
        );
        res.status(200).json({ message: 'Producto actualizado con éxito.' });
        console.log("toi aqui");
        // 2. Obtener el último número de la secuencia `SEC_COD_CLIENTES`
        const resultCodigo = await connection.execute(
            `SELECT last_number FROM user_sequences WHERE sequence_name = 'SEC_COD_CLIENTES'`
        );
        const codigoCliente = resultCodigo.rows[0][0] - 1;
        console.log(codigoCliente);

        // 3. Llamar al procedimiento para insertar en cabecera usando el código de cliente
        const result = await connection.execute(
            `BEGIN OUTLET_Insert_Cabecera(:codigoCliente); END;`,
            { codigoCliente }
        );

        res.status(200).json({ message: 'Cliente y cabecera registrados con éxito.' });

    } catch (error) {
        console.error('Error al actualizar el cliente:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error cerrando la conexión:', err);
            }
        }
    }
};

module.exports = { insertCliente };
