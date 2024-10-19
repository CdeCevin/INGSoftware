const oracledb = require('oracledb');
const { getConnection } = require('../db/connection');

const updateProducto = async (req, res) => {
    const { inputnombre, inputCod, inputStock, inputPrecio, 'input-Stockmin':inputStockmin} = req.body;
    console.log(inputnombre, inputCod, inputStock, inputPrecio, 'input-Stockmin')
    if (!input-Nombre || !input-Cod || !input-Stock || !input-Precio || !'inputStockmin') {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    let connection;
    try {
        connection = await getConnection();
        
        // Llamar al procedimiento almacenado
        const result = await connection.execute(
            `BEGIN OUTLET_Up_Producto(:codigo, :stock, :precio, :nombre, :stock_minimo); END;`,
            {
                codigo: Number(inputCod),
                stock: Number(inputStock),
                precio: Number(inputPrecio),
                nombre: inputNombre,
                stock_minimo: Number(inputStockmin),
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
