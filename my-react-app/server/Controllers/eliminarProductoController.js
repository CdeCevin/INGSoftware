// Importa las dependencias necesarias
const oracledb = require('oracledb');
const connection = require('../db/connection'); // Asegúrate de tener tu archivo de conexión

// Controlador para eliminar un producto
const eliminarProducto = async (req, res) => {
    let connection;
    
    try {
        const { inputcod } = req.body; // Recibir el código del producto desde el frontend
        console.log("HOLAA",inputcod);
        // Establecer la conexión
        conn = await connection.getConnection();
        console.log('Codigo:',inputcod);
        // Ejecutar el procedimiento almacenado
        await conn.execute(
            `BEGIN OUTLET_Elim_Producto(:p_codigo); END;`,
            {
                p_codigo: Number(inputcod) // Pasar el código como número
            }
        );
        await conn.commit();

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



module.exports = {eliminarProducto};
