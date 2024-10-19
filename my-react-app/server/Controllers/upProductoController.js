const oracledb = require('oracledb');
const { getConnection } = require('../db/connection');

const updateProducto = async (req, res) => {
    const { inputNombre, inputCod, inputStock, inputPrecio, inputStockmin } = req.body;
    console.log((inputNombre), number(inputCod), number(inputStock), number(inputPrecio), number(inputStockmin));//PIPIPI NO PARA DE TIRARME undefined undefined undefined undefined undefined
    let connection;
    try {
        connection = await getConnection();
        
        // Llamar al procedimiento almacenado
        const result = await connection.execute(
            `BEGIN OUTLET_Up_Producto(:codigo, :stock, :precio, :nombre, :stock_minimo); END;`,
            {
                codigo: (inputCod),
                stock: (inputStock),
                precio: (inputPrecio),
                nombre: inputNombre,
                stock_minimo: (inputStockmin),
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
