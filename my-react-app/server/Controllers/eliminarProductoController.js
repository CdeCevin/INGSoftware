const oracledb = require('oracledb');
const dbConfig = require('../db/connection'); // Asegúrate de que la conexión esté bien definida

const eliminarProducto = async (req, res) => {
    const { codigo } = req.body;

    if (!codigo) {
        return res.status(400).json({ message: 'No se recibió el código del producto.' });
    }

    let connection;

    try {
        // Obtener la conexión a la base de datos
        connection = await oracledb.getConnection(dbConfig);
        console.log("Conexión exitosa");

        // Ejecutar la consulta para eliminar el producto
        const result = await connection.execute(
            `DELETE FROM productos WHERE codigo = :codigo`,
            [codigo],
            { autoCommit: true } // Confirma los cambios automáticamente
        );

        if (result.rowsAffected === 0) {
            res.status(404).json({ message: 'Producto no encontrado.' });
        } else {
            res.json({ message: 'Producto eliminado correctamente.' });
        }

    } catch (err) {
        console.error('Error al eliminar producto:', err);
        res.status(500).json({ message: 'Error al eliminar el producto.' });
    } finally {
        if (connection) {
            try {
                await connection.close(); // Cierra la conexión a la base de datos
            } catch (err) {
                console.error('Error al cerrar la conexión:', err);
            }
        }
    }
};

module.exports = { eliminarProducto };
