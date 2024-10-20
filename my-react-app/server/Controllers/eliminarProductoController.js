// Importa las dependencias necesarias
const express = require('express');
const oracledb = require('oracledb');
const router = express.Router();
const connection = require('../db/connection'); // Asegúrate de tener tu archivo de conexión

// Controlador para eliminar un producto
const eliminarProducto = async (req, res) => {
    let connection;
    console.log("HOLAA");
    try {
        const { cod } = req.body; // Recibir el código del producto desde el frontend

        // Establecer la conexión
        connection = await getConnection();
        console.log('Codigo:',cod);
        // Ejecutar el procedimiento almacenado
        await connection.execute(
            `BEGIN OUTLET_Elim_Producto(:p_codigo); END;`,
            {
                p_codigo: Number(cod) // Pasar el código como número
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



module.exports = {eliminarProducto};
