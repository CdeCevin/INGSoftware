const oracledb = require('oracledb');
const { getConnection } = require('../db/connection');

// Búsqueda de productos con filtro
const buscarProductos = async (req, res) => {
    let connection;
    try {
        const { codigo, color } = req.query; // parámetros de búsqueda
        connection = await getConnection();

        const cursor = await connection.execute(
            `BEGIN Outlet_FiltrarProducto(:p_PalabraClave, :p_colorp, :c_Productos); END;`,
            {
                p_PalabraClave: codigo,
                p_colorp: color,
                c_Productos: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
            }
        );

        const result = await cursor.outBinds.c_Productos.getRows();
        res.status(200).json({ productos: result });
    } catch (error) {
        console.error('Error al buscar productos:', error);
        res.status(500).json({ message: 'Error al buscar productos.' });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

// Añadir producto al carrito
const anadirCarrito = async (req, res) => {
    let connection;
    try {
        const { productoId, cantidad } = req.body;
        connection = await getConnection();

        // Aquí llamas a un procedimiento almacenado para insertar en el carrito
        await connection.execute(
            `BEGIN InsertarCarrito(:productoId, :cantidad); END;`,
            {
                productoId,
                cantidad
            }
        );

        await connection.commit();
        res.status(200).json({ message: 'Producto añadido al carrito' });
    } catch (error) {
        console.error('Error al añadir al carrito:', error);
        res.status(500).json({ message: 'Error al añadir al carrito.' });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

// Terminar venta
const terminarVenta = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        await connection.execute(`BEGIN FinalizarVenta(); END;`);
        await connection.commit();

        res.status(200).json({ message: 'Venta finalizada' });
    } catch (error) {
        console.error('Error al finalizar la venta:', error);
        res.status(500).json({ message: 'Error al finalizar la venta.' });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

module.exports = { buscarProductos, anadirCarrito, terminarVenta };
