const oracledb = require('oracledb');
const { getConnection } = require('../db/connection');
const { Console } = require('console');

const obtenerPendientes = async (req, res) => {
    let connection;

    try {
        connection = await getConnection();

        // Obtener datos de ventas pendientes
        const query = `
            SELECT VP.ID_VENTA_PENDIENTE, OC.Fecha, OC.Codigo_Cliente, OC.Codigo_Comprobante_Pago,
                   CL.Nombre_Cliente, CL.Codigo_Direccion
            FROM Outlet_Ventas_Pendientes VP
            JOIN Outlet_Cabecera_Comprobante_Pago OC ON VP.CODIGO_COMPROBANTE_PAGO = OC.CODIGO_COMPROBANTE_PAGO
            JOIN Outlet_Cliente CL ON OC.CODIGO_CLIENTE = CL.CODIGO_CLIENTE
        `;

        const result = await connection.execute(query);
        const ventasPendientes = result.rows;
        console.log('Ventas pendientes obtenidas:', ventasPendientes);

        // Crear un arreglo para almacenar las ventas con productos y precios
        const ventasConDetalles = [];

        for (const venta of ventasPendientes) {
            console.log('Procesando venta:', venta);
            const codigoDireccion = Number(venta[5]); // Código de dirección

            // Obtener dirección usando un procedimiento almacenado
            const direccionQuery = `
                BEGIN ObtenerDireccion(:p_CodigoDireccion, :o_NombreCalle, :o_NumeroDireccion, :o_NombreCiudad, :o_NombreRegion); END;
            `;
            const direccionResult = await connection.execute(direccionQuery, {
                p_CodigoDireccion: { val: codigoDireccion, type: oracledb.NUMBER, dir: oracledb.BIND_IN },
                o_NombreCalle: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 },
                o_NumeroDireccion: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 32 },
                o_NombreCiudad: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 },
                o_NombreRegion: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 },
            });

            const nombreCalle = direccionResult.outBinds.o_NombreCalle;
            const numeroDireccion = direccionResult.outBinds.o_NumeroDireccion;
            const nombreCiudad = direccionResult.outBinds.o_NombreCiudad;
            const nombreRegion = direccionResult.outBinds.o_NombreRegion;

            console.log('Detalles de la dirección:', {
                nombreCalle,
                numeroDireccion,
                nombreCiudad,
                nombreRegion,
            });

            // Obtener productos asociados
            const productosQuery = `
                SELECT M.Nombre_Producto, M.Color_Producto, C.Cantidad, C.Precio_Total
                FROM Outlet_Cuerpo_Comprobante_Pago C
                JOIN OUTLET_Producto M ON C.Codigo_Producto = M.Codigo_Producto
                WHERE C.Codigo_Comprobante_Pago = :CodigoComprobante
            `;
            const productosResult = await connection.execute(productosQuery, {
                CodigoComprobante: { val: venta[3], type: oracledb.NUMBER, dir: oracledb.BIND_IN },
            });

            // Sumar los precios totales
            let precioTotal = 0;
            const productos = productosResult.rows.map(producto => {
                precioTotal += producto[3];
                return {
                    nombre: producto[0],
                    color: producto[1],
                    cantidad: producto[2],
                };
            });
            //console.log('Productos para la venta:', productos);

            ventasConDetalles.push({
                idVenta: venta[0],
                fecha: venta[1],
                cliente: venta[4],
                direccion: `${nombreCalle} ${numeroDireccion}, ${nombreCiudad}, ${nombreRegion}`,
                productos, // Aquí usas el array de productos que has creado
                precioTotal,
            });
        }
        //console.log('Productos para la venta:', JSON.stringify(productos, null, 2));

        console.log(JSON.stringify(ventasConDetalles, null, 2)); //PENDIENTE (JAJA)
        console.log(ventasConDetalles);
        res.json(ventasConDetalles);
    } catch (error) {
        console.error('Error al obtener ventas pendientes:', error);
        res.status(500).send('Error al obtener ventas pendientes');
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error al cerrar la conexión:', err);
            }
        }
    }
};
const cancelarPendiente2 = async (req, res) => {
    console.log("Entrando en Cancelar");
    let connection;
    const { idVenta } = req.params;  // El id de la venta vendrá desde el frontend

    try {
        connection = await getConnection();
        
        // Ejecutar el procedimiento almacenado para cancelar
        const query = `BEGIN OUTLET_Cancel_Pendiente(:idVenta); END;`;
        await connection.execute(query, { idVenta: { val: Number(idVenta), dir: oracledb.BIND_IN } });
        
        res.status(200).send('Venta pendiente cancelada con éxito');
    } catch (error) {
        console.error('Error al cancelar la venta pendiente:', error);
        res.status(500).send('Error al cancelar la venta pendiente');
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error al cerrar la conexión:', err);
            }
        }
    }
};

const cancelarPendiente = async (req, res) => {
    let connection;
    try {
      const { idVenta } = req.body;
  
      // Verifica que el código no sea indefinido
      console.log('Código recibido desde el frontend:', idVenta);
      
      // Establece la conexión
      connection = await getConnection(); // Llama a la función de conexión
  
      // Ejecuta el procedimiento almacenado
      await connection.execute(
        `BEGIN OUTLET_Cancel_Pendiente(:p_idVenta); END;`,
        {
            
          p_idVenta: oracledb.NUMBER(idVenta) // Asegúrate de que el código sea un número

        }
      );
  
      await connection.commit();
  
      res.status(200).json({ message: 'Venta cancelada correctamente.' });
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      res.status(500).json({ message: 'Error al cancelar venta' });
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  };

const realizarPendiente = async (req, res) => {
    console.log("Entrando en Realizar");
    let connection;
    const { idVenta } = req.params;

    try {
        connection = await getConnection();

        // Ejecutar el procedimiento almacenado para marcar como realizado
        const query = `BEGIN OUTLET_Elim_Pendiente(:idVenta); END;`;
        await connection.execute(query, { idVenta: { val: Number(idVenta), dir: oracledb.BIND_IN } });

        res.status(200).send('Venta pendiente realizada con éxito');
    } catch (error) {
        console.error('Error al realizar la venta pendiente:', error);
        res.status(500).send('Error al realizar la venta pendiente');
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error al cerrar la conexión:', err);
            }
        }
    }
};

module.exports = { obtenerPendientes, cancelarPendiente, realizarPendiente };


