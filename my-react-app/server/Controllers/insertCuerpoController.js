const oracledb = require('oracledb');
const { getConnection } = require('../db/connection');

const insertCuerpo = async (req, res) => {
    let connection;
    try {
        const { productos } = req.body; // Suponiendo que productos es un array de objetos
        console.log("ALOOOOOOOOOOOOOOO");
        // Verifica que haya productos en el carrito
        if (!productos || productos.length === 0) {
            return res.status(400).json({ message: 'No se han proporcionado productos.' });
        }

        connection = await getConnection();

        for (const producto of productos) {
            const { codigo, cantidad } = producto;

            // Preparar y ejecutar la consulta para cada producto
            const query_cuerpo = `BEGIN OUTLET_Insert_Cuerpo(:codigo, :cantidad); END;`;

            const result = await connection.execute(query_cuerpo, {
                codigo: codigo,
                cantidad: cantidad,
            });

            // Aquí puedes agregar lógica para manejar el resultado de la inserción
        }

        res.status(200).json({ message: 'Productos añadidos al carrito.' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Error al añadir productos al carrito.' });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

module.exports = { insertCuerpo };
