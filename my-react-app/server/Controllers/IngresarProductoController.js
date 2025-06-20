// my-react-app/server/Controllers/IngresarProductoController.js

const multer = require('multer');
const path = require('path');
const { getConnection } = require('../db/connection');

// Configuración de Multer para subir imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'public', 'images', 'outlet'));
    },
    filename: (req, file, cb) => {
        // const ext = path.extname(file.originalname); // Línea original
        const ext = '.jpg'; // <-- CAMBIO IMPORTANTE: Forzamos la extensión a .jpg
        const codigo = req.body['input-cod'];
        // Asegúrate de que el código del producto sea válido para un nombre de archivo
        if (!codigo) {
            return cb(new Error('Product code is required for filename.'), null);
        }
        // Guarda la extensión en req.body para que esté disponible en ingresarProducto
        req.body.imagenExtension = ext; // La extensión siempre será '.jpg' aquí
        cb(null, `${codigo}${ext}`);
    },
});

const upload = multer({ storage: storage });

// Define la función del controlador por separado para poder exportarla
async function ingresarProducto(req, res) {
    const {
        'input-nombre': nombre,
        'input-cod': codigo,
        'input-stock': stock,
        'input-precio': precio,
        'input-color': color,
        'input-tipo': tipo,
        'input-stockmin': stockmin,
        imagenExtension // Se seguirá recuperando, que ahora siempre será '.jpg'
    } = req.body;

    let connection;

    try {
        connection = await getConnection();

        const query = `
            BEGIN
                OUTLET_Insert_Producto(:codigo, :stock, :precio, :nombre, :color, :tipo, :stockmin, :imagenExtension);
            END;
        `;

        await connection.execute(query, {
            codigo: Number(codigo),
            stock: Number(stock),
            precio: Number(precio),
            nombre: nombre,
            color: color,
            tipo: tipo,
            stockmin: Number(stockmin),
            imagenExtension: imagenExtension // Se insertará '.jpg' en la DB
        });

        await connection.commit();
        res.status(200).json({ message: 'Producto añadido correctamente' });
    } catch (error) {
        console.error('Error al insertar el producto:', error);

        let errorMessage = 'Ocurrió un error al insertar el producto. Por favor, intenta de nuevo más tarde.';
        if (error.errorNum === 1 || error.message.includes('unique constraint')) {
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
}

// Exporta tanto `upload` como `ingresarProducto`
module.exports = { upload, ingresarProducto };