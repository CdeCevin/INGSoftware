const oracledb = require('oracledb');
const dbConnection = require('../db/connection'); // Asegúrate de usar el nombre correcto

const eliminarProducto = async (req, res) => {
    let conn;
    try {
        const { codigo } = req.body; // Recibir el código del producto desde el frontend

        // Establecer la conexión
        conn = await dbConnection.getConnection(); // Llama a getConnection desde dbConnection
        console.log("Hola, este es el codigo: ", codigo);
        // Ejecutar el procedimiento almacenado
        await conn.execute(
            `BEGIN OUTLET_Elim_Producto(:p_codigo); END;`,
            {
                p_codigo: parseInt(codigo) // Pasar el código como número
            }
        );

        await conn.commit();

        // Respuesta exitosa
        res.status(200).json({ message: 'Producto eliminado correctamente.' });
    } catch (err) {
        console.error('Error al eliminar producto:', err);
        res.status(500).json({ message: 'Error al eliminar el producto.' });
    } finally {
        if (conn) {
            await conn.close();
        }
    }
};

module.exports = { eliminarProducto };
