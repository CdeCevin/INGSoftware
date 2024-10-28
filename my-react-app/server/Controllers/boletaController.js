const oracledb = require('oracledb');

async function boleta(req, res) {
    const dbConfig = {
        user: 'Cevin',
        password: '213233963Y',
        connectString: 'localhost:1521/XE'
    };

    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);

        // 1. Obtener el último número de la secuencia `SEC_COD_CABECERA`
        const codigoResult = await connection.execute(
            `SELECT last_number FROM user_sequences WHERE sequence_name = 'SEC_COD_CABECERA'`
        );
        const codigoCabecera = codigoResult.rows[0][0] - 1;

        // 2. Llamar al procedimiento almacenado `ObtenerBoleta`
        const result = await connection.execute(
            `BEGIN ObtenerBoleta(:CodigoCabecera, :cursor_cabecera, :cursor_cuerpo); END;`,
            {
                CodigoCabecera: { val: codigoCabecera, dir: oracledb.BIND_IN },
                cursor_cabecera: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
                cursor_cuerpo: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
            }
        );

        const cursorCabecera = result.outBinds.cursor_cabecera;
        const cursorCuerpo = result.outBinds.cursor_cuerpo;

        const cabeceraRows = await cursorCabecera.getRows(); // Información de la cabecera
        const cuerpoRows = await cursorCuerpo.getRows();     // Detalles de los productos

        await cursorCabecera.close();
        await cursorCuerpo.close();

        // 3. Obtener detalles adicionales de cliente (Dirección)
        const clienteResult = await connection.execute(
            `SELECT Codigo_Direccion FROM OUTLET_CLIENTE WHERE Codigo_Cliente = :CodC`,
            { CodC: { val: cabeceraRows[0].CODIGO_CLIENTE, dir: oracledb.BIND_IN } }
        );

        let direccionDetails = {};
        if (clienteResult.rows.length > 0) {
            const p_CodigoDireccion = clienteResult.rows[0][0];

            await connection.execute(
                `BEGIN ObtenerDireccion(:p_CodigoDireccion, :o_NombreCalle, :o_NumeroDireccion, :o_NombreCiudad, :o_NombreRegion); END;`,
                {
                    p_CodigoDireccion: { val: p_CodigoDireccion, dir: oracledb.BIND_IN },
                    o_NombreCalle: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
                    o_NumeroDireccion: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
                    o_NombreCiudad: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
                    o_NombreRegion: { type: oracledb.STRING, dir: oracledb.BIND_OUT }
                },
                (err, result) => {
                    if (err) throw err;
                    direccionDetails = {
                        nombreCalle: result.outBinds.o_NombreCalle,
                        numeroDireccion: result.outBinds.o_NumeroDireccion,
                        nombreCiudad: result.outBinds.o_NombreCiudad,
                        nombreRegion: result.outBinds.o_NombreRegion
                    };
                }
            );
        }

        // 4. Responder con un JSON
        res.json({
            cabecera: cabeceraRows[0],
            productos: cuerpoRows,
            direccion: direccionDetails,
            codigoCabecera: codigoCabecera
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error al obtener la boleta");
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
