//Tengo este codigo en ./controllers/boletaController.js

const oracledb = require('oracledb');
const { getConnection } = require('../../db/connection');

async function boleta(req, res) {
    let connection;

    try {
        connection = await getConnection();
        console.log('Conexión establecida con la base de datos.');

        // 1. Obtener el CodigoCabecera desde los parámetros de la solicitud
        // Si se llama como una ruta normal, será req.params.id
        // Si se llama internamente, lo habremos pasado en boletaReq.params.id
        const codigoCabecera = req.params.id;

        // Validación básica
        if (!codigoCabecera) {
            console.error('Error: CodigoCabecera no proporcionado en la solicitud.');
            return res.status(400).send('Error: Codigo de cabecera de boleta no proporcionado.');
        }

        console.log('Generando boleta para CodigoCabecera:', codigoCabecera);

        // Ya no necesitamos esta consulta:
        // const codigoResult = await connection.execute(
        // `SELECT last_number FROM user_sequences WHERE sequence_name = 'SEC_COD_CABECERA'`
        // );
        // const codigoCabecera = codigoResult.rows[0][0] - 1;


        // 2. Llamar al procedimiento almacenado `ObtenerBoleta`
        const result = await connection.execute(
            `BEGIN ObtenerBoleta(:CodigoCabecera, :cursor_cabecera, :cursor_cuerpo); END;`,
            {
                CodigoCabecera: { val: Number(codigoCabecera), dir: oracledb.BIND_IN }, // Asegúrate de convertirlo a Number
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

        // Si no hay datos para el codigoCabecera, se puede retornar un error 404
        if (cabeceraRows.length === 0) {
            return res.status(404).send('Boleta no encontrada para el código proporcionado.');
        }


        const codigoCliente = cabeceraRows[0][1]; // Asegúrate de que el índice sea correcto
        console.log('El codigo del cliente es: ', codigoCliente);

        // 3. Llamar a las funciones de Oracle para obtener el nombre y teléfono del cliente
        const nombreClienteResult = await connection.execute(
            `BEGIN :result := OUTLET_Fun_Nombre(:codigo); END;`,
            {
                codigo: { val: codigoCliente, dir: oracledb.BIND_IN },
                result: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 130 }
            }
        );

        const telefonoClienteResult = await connection.execute(
            `BEGIN :telefono := OUTLET_Fun_Telefono(:codigo); END;`,
            {
                codigo: { val: codigoCliente, dir: oracledb.BIND_IN },
                telefono: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            }
        );

        const nombreCliente = nombreClienteResult.outBinds.result;
        const telefonoCliente = telefonoClienteResult.outBinds.telefono;

        // 4. Obtener detalles adicionales de cliente (Dirección)
        const clienteResult = await connection.execute(
            `SELECT Codigo_Direccion FROM OUTLET_CLIENTE WHERE Codigo_Cliente = :CodC`,
            { CodC: { val: codigoCliente, dir: oracledb.BIND_IN } }
        );

        let direccionDetails = {};
        if (clienteResult.rows.length > 0) {
            const p_CodigoDireccion = clienteResult.rows[0][0];
            console.log('El codigo de direccion es:', p_CodigoDireccion);

            // Llamada al procedimiento para obtener la dirección
            const direccionResult = await connection.execute(
                `BEGIN ObtenerDireccion(:p_CodigoDireccion, :o_NombreCalle, :o_NumeroDireccion, :o_NombreCiudad, :o_NombreRegion); END;`,
                {
                    p_CodigoDireccion: { val: p_CodigoDireccion, dir: oracledb.BIND_IN },
                    o_NombreCalle: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 130 },
                    o_NumeroDireccion: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
                    o_NombreCiudad: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 100 },
                    o_NombreRegion: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 100 }
                }
            );

            direccionDetails = {
                nombreCalle: direccionResult.outBinds.o_NombreCalle,
                numeroDireccion: direccionResult.outBinds.o_NumeroDireccion,
                nombreCiudad: direccionResult.outBinds.o_NombreCiudad,
                nombreRegion: direccionResult.outBinds.o_NombreRegion
            };
        }

        // 5. Construir la cabecera de la respuesta
        const cabecera = {
            RUT_USUARIO: cabeceraRows[0][2],
            NOMBRE_USUARIO: cabeceraRows[0][3],
            NOMBRE_CLIENTE: nombreCliente,
            TELEFONO: telefonoCliente,
            FECHA: cabeceraRows[0][0]
        };

        console.log('Cabecera: ', cabecera, 'Cuerpo: ', cuerpoRows, 'Direccion: ', direccionDetails, 'Codigo: ', codigoCabecera);

        // 7. Responder con un JSON
        res.json({
            cabecera,
            productos: cuerpoRows,
            direccion: direccionDetails,
            codigoCabecera
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