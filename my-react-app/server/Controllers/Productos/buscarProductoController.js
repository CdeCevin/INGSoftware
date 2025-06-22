const oracledb = require('oracledb');
const { getConnection } = require('../../db/connection');

const buscarProducto = async (req, res) => {
    const { 'input-nombre': nombre, 'input-color': color } = req.body;

    // Asignar null si no hay valor
    const palabraClave = nombre && nombre.trim() ? nombre.trim() : '';
    const colorParam = color && color.trim() ? color.trim() : '';

    console.log('Nombre:', palabraClave);
    console.log('Color:', colorParam);

    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(
            `BEGIN Outlet_FiltrarProducto(:p_PalabraClave, :p_colorp, :c_Productos); END;`,
            {
                p_PalabraClave: palabraClave,
                p_colorp: colorParam,
                c_Productos: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
            }
        );

        const resultCursor = result.outBinds.c_Productos;
        
        // Procesar los resultados del cursor
        const productos = [];
        let row;
        while ((row = await resultCursor.getRow())) {
            productos.push({
                codigo_producto: row[0],
                activo: row[1],
                stock: row[2],
                precio_unitario: row[3],
                nombre_producto: row[4],
                tipo_producto: row[5],
                color_producto: row[6],
                stock_minimo: row[7]
            });
        }

        await resultCursor.close(); // Cerrar el cursor después de procesar los datos
        //console.log(productos);
        // Enviar los resultados como respuesta JSON
        res.status(200).json({ message: 'Búsqueda exitosa', data: productos });
    } catch (err) {
        console.error('Error en la búsqueda de productos:', err);
        res.status(500).json({ message: 'Error al buscar el producto.' });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

module.exports = { buscarProducto };
