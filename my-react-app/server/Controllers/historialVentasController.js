const oracledb = require('oracledb');
const { getConnection } = require('../db/connection');

async function obtenerReporteVentas(req, res) {
    let connection;
    try {
        connection = await getConnection();

        const queryCabecera = `
            SELECT OC.Codigo_Comprobante_Pago, OC.Fecha, OC.Codigo_Cliente,
                   CL.Nombre_Cliente, CL.Codigo_Direccion
            FROM Outlet_Cabecera_Comprobante_Pago OC
            JOIN Outlet_Cliente CL ON OC.CODIGO_CLIENTE = CL.CODIGO_CLIENTE`;

        const resultCabecera = await connection.execute(queryCabecera);
        const ventas = [];

        for (const row of resultCabecera.rows) {
            const p_CodigoDireccion = row[4];

            const queryDireccion = `
                BEGIN ObtenerDireccion(:p_CodigoDireccion, :o_NombreCalle, :o_NumeroDireccion, :o_NombreCiudad, :o_NombreRegion); END;`;

            const resultDireccion = await connection.execute(queryDireccion, {
                p_CodigoDireccion,
                o_NombreCalle: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 130 },
                o_NumeroDireccion: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_NombreCiudad: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 },
                o_NombreRegion: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 }
            });

            const direccion = `${resultDireccion.outBinds.o_NombreCalle} ${resultDireccion.outBinds.o_NumeroDireccion}, ${resultDireccion.outBinds.o_NombreCiudad}, ${resultDireccion.outBinds.o_NombreRegion}`;

            const queryProductos = `
                SELECT M.Nombre_Producto, M.Color_Producto, C.Cantidad, C.Precio_Total
                FROM Outlet_Cuerpo_Comprobante_Pago C
                JOIN OUTLET_Producto M ON C.Codigo_Producto = M.Codigo_Producto
                WHERE C.Codigo_Comprobante_Pago = :CodigoComprobante`;

            const resultProductos = await connection.execute(queryProductos, { CodigoComprobante: row[0] });

            let precioTotal = 0;
            const productos = [];

            for (const prod of resultProductos.rows) {
                productos.push(`${prod[0]} (${prod[2]} ${prod[1]})`);
                precioTotal += prod[3];
            }

            ventas.push({
                codigoComprobante: row[0],
                fecha: row[1],
                nombreCliente: row[3],
                direccionCalle: resultDireccion.outBinds.o_NombreCalle,
                numeroDireccion: resultDireccion.outBinds.o_NumeroDireccion,
                ciudad: resultDireccion.outBinds.o_NombreCiudad,
                region: resultDireccion.outBinds.o_NombreRegion,
                productos,
                precioTotal
            });
        }

        res.json(ventas);
    } catch (err) {
        console.error('Error al obtener el reporte de ventas:', err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

async function obtenerBoletaPorCodigo(req, res) {
    let connection;

    try {
        connection = await getConnection();
        console.log('Conexión establecida con la base de datos.');

        const codigoComprobante = req.params.id;

        if (!codigoComprobante) {
            console.error('Error: CodigoCabecera no proporcionado en la solicitud.');
            return res.status(400).send('Error: Código de cabecera de boleta no proporcionado.');
        }

        console.log('Generando boleta para CodigoCabecera:', codigoComprobante);

        const result = await connection.execute(
            `BEGIN ObtenerBoleta(:CodigoCabecera, :cursor_cabecera, :cursor_cuerpo); END;`,
            {
                codigoComprobante: { val: Number(codigoComprobante), dir: oracledb.BIND_IN },
                cursor_cabecera: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
                cursor_cuerpo: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
            }
        );

        const cursorCabecera = result.outBinds.cursor_cabecera;
        const cursorCuerpo = result.outBinds.cursor_cuerpo;

        const cabeceraRows = await cursorCabecera.getRows();
        const cuerpoRows = await cursorCuerpo.getRows();

        await cursorCabecera.close();
        await cursorCuerpo.close();

        if (cabeceraRows.length === 0) {
            return res.status(404).send('Boleta no encontrada para el código proporcionado.');
        }

        const codigoCliente = cabeceraRows[0][1];
        console.log('El codigo del cliente es: ', codigoCliente);

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

        const clienteResult = await connection.execute(
            `SELECT Codigo_Direccion FROM OUTLET_CLIENTE WHERE Codigo_Cliente = :CodC`,
            { CodC: { val: codigoCliente, dir: oracledb.BIND_IN } }
        );

        let direccionDetails = {};
        if (clienteResult.rows.length > 0) {
            const p_CodigoDireccion = clienteResult.rows[0][0];
            console.log('El codigo de direccion es:', p_CodigoDireccion);

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

        const cabecera = {
            RUT_USUARIO: cabeceraRows[0][2],
            NOMBRE_USUARIO: cabeceraRows[0][3],
            NOMBRE_CLIENTE: nombreCliente,
            TELEFONO: telefonoCliente,
            FECHA: cabeceraRows[0][0]
        };

        console.log('Cabecera: ', cabecera, 'Cuerpo: ', cuerpoRows, 'Direccion: ', direccionDetails, 'Codigo: ', codigoCabecera);

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

module.exports = {
    obtenerReporteVentas,
    obtenerBoletaPorCodigo
};