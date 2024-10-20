const oracledb = require('oracledb');
const dbConnection = require('../db/connection'); // Asegúrate de usar el nombre correcto

const eliminarProducto = async (req, res) => {
    let connection;
    try {
        const { codigo } = req.body; // Verifica que el código venga en el cuerpo como JSON

        if (!codigo) {
            return res.status(400).json({ message: 'Código de producto no proporcionado.' });
        }

        // Establecer la conexión
        connection = await oracledb.getConnection();

        // Ejecutar el procedimiento almacenado
        await connection.execute(
            `BEGIN OUTLET_Elim_Producto(:p_codigo); END;`,
            {
                p_codigo: parseInt(codigo) // Asegúrate de que sea un número
            }
        );

        await connection.commit();

        // Respuesta exitosa
        res.status(200).json({ message: 'Producto eliminado correctamente.' });
    } catch (err) {
        console.error('Error al eliminar producto:', err);
        res.status(500).json({ message: 'Error al eliminar el producto.' });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};


module.exports = { eliminarProducto };
