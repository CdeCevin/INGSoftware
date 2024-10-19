const oracledb = require('oracledb');
const { getConnection } = require('../db/connection');

const updateProducto = async (req, res) => {
    const { inputNombre, inputCod, inputStock, inputPrecio, inputStockmin } = req.body;

    if (!inputNombre || !inputCod || !inputStock || !inputPrecio || !inputStockmin) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    let connection;
    try {
        connection = await getConnection();
        const sql = `
            UPDATE productos 
            SET nombre = :nombre, stock = :stock, precio = :precio, stock_minimo = :stockmin 
            WHERE codigo = :codigo
        `;
        const params = {
            nombre: inputNombre,
            stock: inputStock,
            precio: inputPrecio,
            stockmin: inputStockmin,
            codigo: inputCod,
        };

        const result = await connection.execute(sql, params);
        await connection.commit();

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }

        res.status(200).json({ message: 'Producto actualizado con éxito.' });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
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

module.exports = { updateProducto };
