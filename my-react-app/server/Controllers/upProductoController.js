const oracledb = require('oracledb');
const { getConnection } = require('../db/connection');

const updateProducto = async (req, res) => {
    const { inputNombre, inputCod, inputStock, inputPrecio, inputStockmin } = req.body;

    let connection;
    try {
        connection = await getConnection();
        
        // Convertir valores 'null' a null, excepto el código que no debe ser nulo
        const codigo = Number(inputCod);
        const stock = inputStock ? Number(inputStock) : null;
        const precio = inputPrecio ? Number(inputPrecio) : null;
        const stock_minimo = inputStockmin ? Number(inputStockmin) : null;

        // Llamar al procedimiento almacenado
        const result = await connection.execute(
            `BEGIN OUTLET_Up_Producto(:codigo, :stock, :precio, :nombre, :stock_minimo); END;`,
            {
                codigo,
                stock,
                precio,
                nombre: inputNombre,
                stock_minimo,
            }
        );

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
