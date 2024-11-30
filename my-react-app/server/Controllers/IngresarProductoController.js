const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getConnection } = require('../db/connection'); // Importar la conexión

// Configuración de Multer para subir imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'C:/Users/Koliv/Desktop/todo/Nueva carpeta/Outlet'); // Cambia el destino si es necesario
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const codigo = req.body['input-cod'];
        cb(null, `${codigo}${ext}`);
    },
});

const upload = multer({ storage: storage });

// Ruta para insertar producto
router.post('/insertar', upload.single('input-imagen'), async (req, res) => {
    const { 
        'input-nombre': nombre, 
        'input-cod': codigo, 
        'input-stock': stock, 
        'input-precio': precio, 
        'input-color': color, 
        'input-tipo': tipo, 
        'input-stockmin': stockmin 
    } = req.body;
    
    console.log('Datos recibidos en el backend:', {
        codigo, stock, precio, stockmin // Mostrar los campos numéricos
    });
    
    let connection;

    try {
        connection = await getConnection(); // Usa la conexión de tu archivo db/connection.js
        
        const query = `
            BEGIN 
                OUTLET_Insert_Producto(:codigo, :stock, :precio, :nombre, :color, :tipo, :stockmin); 
            END;
        `;

        await connection.execute(query, {
            codigo: Number(codigo),
            stock: Number(stock),
            precio: Number(precio),
            nombre: nombre,
            color: color,
            tipo: tipo,
            stockmin: Number(stockmin)
        });

        await connection.commit();
        res.status(200).json({ message: 'Producto añadido correctamente' });
    } catch (error) {
        console.error('Error al insertar el producto:', error);
        
        // Aquí puedes personalizar el mensaje de error
        let errorMessage;
        if (error.code === '23505') { // Código de error de duplicado, por ejemplo
            errorMessage = 'El código del producto ya existe.';
        } else {
            errorMessage = 'Ocurrió un error al insertar el producto. Por favor, intenta de nuevo más tarde.';
        }
        
        res.status(500).json({ message: errorMessage });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err.message);
            }
        }
    }
});

module.exports = router;
