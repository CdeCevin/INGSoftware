// CdeCevin/INGSoftware/my-react-app/server/Controllers/upProductoController.js

const oracledb = require('oracledb');
const path = require('path'); // Asegúrate de que 'path' está importado
const { getConnection } = require('../../db/connection');
const multer = require('multer');

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // La ruta de destino es server/public/images/outlet
        cb(null, path.join(__dirname, '../../', 'public', 'images', 'outlet'));
    },
    filename: (req, file, cb) => {
        const ext = '.jpg'; // Forzando a JPG
        // El código del producto viene del parámetro de la URL (req.params.codigo)
        // Opcional: si esperas que inputCod también venga en el body, puedes usar req.body['inputCod']
        // Pero es mejor que el identificador único esté en la URL para PUT.
        const codigo = req.params.codigo; 
        
        if (!codigo) {
            return cb(new Error('Product code is required for filename.'), null);
        }
        cb(null, `${codigo}${ext}`); // Sobrescribe el archivo si ya existe con el mismo nombre
    },
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 5 MB
    }
});

const updateProducto = async (req, res) => {
    const codigo = req.params.codigo; 

    // Los demás campos vienen de req.body (parsed por Multer)
    const { inputNombre, inputStock, inputPrecio, inputStockmin } = req.body;
    


    let connection;
    try {
        connection = await getConnection();

        // Convertir valores a `null` si son cadenas vacías, o a número
        const stock = inputStock ? Number(inputStock) : null;
        const precio = inputPrecio ? Number(inputPrecio) : null;
        const nombre = inputNombre || null; // Si no hay nombre, enviar null
        const stock_minimo = inputStockmin ? Number(inputStockmin) : null;

        // Validar si el código es un número válido
        if (isNaN(Number(codigo))) {
            return res.status(400).json({ message: 'El código del producto debe ser un número válido.' });
        }


        const result = await connection.execute(
            `BEGIN OUTLET_Up_Producto(:codigo, :stock, :precio, :nombre, :stock_minimo); END;`,
            {
                codigo: Number(codigo), // Asegúrate de que el código sea un número
                stock: stock,
                precio: precio,
                nombre: nombre,
                stock_minimo: stock_minimo,
            },
            { autoCommit: true } // Confirmar la transacción
        );
        console.log('Resultado de la actualización:', result);
        res.status(200).json({ message: 'Producto actualizado con éxito.' });

    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar el producto.' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error cerrando la conexión:', err);
            }
        }
    }
};

module.exports = { upload, updateProducto };