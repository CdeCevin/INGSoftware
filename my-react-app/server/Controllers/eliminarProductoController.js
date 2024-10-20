const oracledb = require('oracledb');
const dbConfig = require('../db/connection'); // Asegúrate de usar el nombre correcto

const eliminarProducto = async (req, res) => {
    let connection;
    try {
        const { codigo } = req.body;
        
        console.log("Código recibido desde el frontend:", codigo); // Verifica el valor que llega desde el frontend

        // Establecer la conexión
        connection = await oracledb.getConnection(dbConfig);

        // Ejecutar el procedimiento almacenado
        await connection.execute(
            `BEGIN OUTLET_Elim_Producto(:p_codigo); END;`,
            {
                p_codigo: parseInt(codigo) // Pasar el código como número
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
