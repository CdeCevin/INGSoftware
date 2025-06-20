const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getConnection } = require('../db/connection');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Usa path.join para construir la ruta relativa a la carpeta 'server/public/images/outlet'
        // __dirname es el directorio actual (my-react-app/server/Controllers)
        // '../..' sube dos niveles (a my-react-app/server)
        // Luego, 'public', 'images', 'outlet' te lleva a la carpeta de destino
        cb(null, path.join(__dirname, '..', 'public', 'images', 'outlet'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const codigo = req.body['input-cod'];
        // Asegúrate de que el código del producto sea válido para un nombre de archivo
        if (!codigo) {
            return cb(new Error('Product code is required for filename.'), null);
        }
        cb(null, `${codigo}${ext}`);
    },
});

const upload = multer({ storage: storage });

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

    // console.log('Datos recibidos en el backend:', {
    //     codigo, stock, precio, stockmin
    // });

    let connection;

    try {
        connection = await getConnection();

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

        let errorMessage = 'Ocurrió un error al insertar el producto. Por favor, intenta de nuevo más tarde.';
        // Ejemplo de manejo de errores específico para Oracle, ajusta según tus códigos de error
        if (error.errorNum === 1 || error.message.includes('unique constraint')) { // ORA-00001 for unique constraint violation
             errorMessage = 'El código del producto ya existe.';
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

module.exports = { upload, ingresarProducto };