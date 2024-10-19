const oracledb = require('oracledb');
const { getConnection } = require('../db/connection');

const updateProducto = async (req, res) => {
    // Extrae los valores de req.body
    const { nombre, 'input-cod': inputCod, 'input-stock': inputStock, 'input-precio': inputPrecio, 'input-stockmin': inputStockmin } = req.body;
    
    console.log(nombre, inputCod, inputStock, inputPrecio, inputStockmin); // Revisa la consola para ver los valores recibidos

    // Verifica que todos los campos son obligatorios
    if (!nombre || !inputCod || !inputStock || !inputPrecio || !inputStockmin) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    let connection;
    try {
        connection = await getConnection();
        
        // Llama al procedimiento almacenado
        const result = await connection.execute(
            `BEGIN OUTLET_Up_Producto(:codigo, :stock, :precio, :nombre, :stock_minimo); END;`,
            {
                codigo: Number(inputCod),
                stock: Number(inputStock),
                precio: Number(inputPrecio),
                nombre: nombre, // Aquí ya tienes el nombre bien referenciado
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
