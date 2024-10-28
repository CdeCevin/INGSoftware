const oracledb = require('oracledb');
const { getConnection } = require('../db/connection');

async function boleta(req, res) {
    let connection;

    try {
        // Conectar a la base de datos
        connection = await getConnection();
        console.log("hola toi aca");
        // Obtener el último número de la secuencia
        const resultSeq = await connection.execute("SELECT last_number FROM user_sequences WHERE sequence_name = 'SEC_COD_CABECERA'");
        const codigoCabecera = resultSeq.rows[0][0] - 1; // Restar 1


        // Preparar y ejecutar el procedimiento almacenado para obtener la boleta
        const result = await connection.execute(
            `BEGIN ObtenerBoleta(:CodigoCabecera, :cursor_cabecera, :cursor_cuerpo); END;`,
            {
                CodigoCabecera: { val: codigoCabecera, dir: oracledb.BIND_IN },
                cursor_cabecera: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
                cursor_cuerpo: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
            }
        );

        // Obtener los cursores
        const cursorCabecera = result.outBinds.cursor_cabecera;
        const cursorCuerpo = result.outBinds.cursor_cuerpo;

        // Obtener los datos de la cabecera
        const cabeceraRows = await cursorCabecera.getRows();
        const cabecera = cabeceraRows[0]; // Asumiendo que solo necesitas la primera fila

        // Obtener los datos del cuerpo
        const cuerpoRows = await cursorCuerpo.getRows();
        const productos = cuerpoRows;

        // Cerrar cursores
        await cursorCabecera.close();
await cursorCuerpo.close();


        // Registrar la venta pendiente
        await connection.execute(
            `BEGIN RegistrarVentaPendiente(:CodigoCabecera); END;`,
            {
                CodigoCabecera: { val: codigoCabecera, dir: oracledb.BIND_IN }
            }
        );

        // Obtener la dirección del cliente
// Obtener la dirección del cliente
    const codigoCliente = cabecera.CODIGO_CLIENTE; // Suponiendo que esto está en la cabecera
    const direccionResult = await connection.execute(
        `SELECT Codigo_Direccion FROM OUTLET_CLIENTE WHERE Codigo_Cliente = :CodC`,
        { CodC: { val: codigoCliente, dir: oracledb.BIND_IN } }
    );
    console.log('DireccionResult: ', direccionResult);

    // Verificar si se encontró la dirección antes de acceder a ella
    if (direccionResult.rows.length === 0) {
        console.error('No se encontró dirección para el cliente con código:', codigoCliente);
        res.status(404).send('No se encontró dirección para el cliente especificado');
        return;
    }

    const p_CodigoDireccion = direccionResult.rows[0][0];

    // Obtener detalles de la dirección
    const direccionDetails = {};
    await connection.execute(
        `BEGIN ObtenerDireccion(:p_CodigoDireccion, :o_NombreCalle, :o_NumeroDireccion, :o_NombreCiudad, :o_NombreRegion); END;`,
        {
            p_CodigoDireccion: { val: p_CodigoDireccion, dir: oracledb.BIND_IN },
            o_NombreCalle: { type: oracledb.STRING, dir: oracledb.BIND_OUT, val: direccionDetails.nombreCalle },
            o_NumeroDireccion: { type: oracledb.STRING, dir: oracledb.BIND_OUT, val: direccionDetails.numeroDireccion },
            o_NombreCiudad: { type: oracledb.STRING, dir: oracledb.BIND_OUT, val: direccionDetails.nombreCiudad },
            o_NombreRegion: { type: oracledb.STRING, dir: oracledb.BIND_OUT, val: direccionDetails.nombreRegion }
        }
    );


        // Cerrar la conexión
        await connection.close();

        // Construir la respuesta
        console.log(cabecera,
            productos,
            direccionDetails,
            codigoCabecera);
        res.json({
            cabecera,
            productos,
            direccion: direccionDetails,
            codigoCabecera
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener la boleta');
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

module.exports = { boleta };
