const express = require('express');
const oracledb = require('oracledb');
const multer = require('multer');
const upload = multer(); // Inicializar multer
const { getConnection } = require('../db/connection'); // Ajusta esto según tu estructura

const router = express.Router();

router.post(upload.none(), async (req, res) => {
    // Accediendo a los campos como los has definido en tu formulario
    const { 
        'input-nombre': nombre, 
        'input-Cod': codigo, 
        'input-Stock': stock, 
        'input-Precio': precio, 
        'input-Stockmin': stockmin 
    } = req.body;

    // Imprimir los valores para verificar
    console.log('Valores recibidos:', {
        nombre, codigo, stock, precio, stockmin
    });

    if (!nombre || !codigo || !stock || !precio || !stockmin) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    let connection;
    try {
        connection = await getConnection();

        // Llama al procedimiento almacenado
        const result = await connection.execute(
            `BEGIN OUTLET_Up_Producto(:codigo, :stock, :precio, :nombre, :stock_minimo); END;`,
            {
                codigo: Number(codigo),      // Se asegura de que los tipos sean correctos
                stock: Number(stock),
                precio: Number(precio),
                nombre: nombre,
                stock_minimo: Number(stockmin),
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
});

module.exports = router;
