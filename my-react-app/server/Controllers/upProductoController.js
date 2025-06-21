// CdeCevin/INGSoftware/my-react-app/server/Controllers/upProductoController.js

const oracledb = require('oracledb');
const path = require('path'); // Asegúrate de que 'path' está importado
const { getConnection } = require('../db/connection');
const multer = require('multer');

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // La ruta de destino es server/public/images/outlet
        cb(null, path.join(__dirname, '..', 'public', 'images', 'outlet'));
    },
    filename: (req, file, cb) => {
        const ext = '.jpg'; // Forzando a JPG
        // El código del producto viene del parámetro de la URL (req.params.codigo)
        // Opcional: si esperas que inputCod también venga en el body, puedes usar req.body['inputCod']
        // Pero es mejor que el identificador único esté en la URL para PUT.
        const codigo = req.params.codigo; // ****** CAMBIO: Obtener código de req.params ******
        
        if (!codigo) {
            return cb(new Error('Product code is required for filename.'), null);
        }
        cb(null, `${codigo}${ext}`); // Sobrescribe el archivo si ya existe con el mismo nombre
    },
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Opcional: Validar tipos de archivo si no lo haces en el frontend
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    },
    // Limite de tamaño de archivo (ej. 5MB)
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
});

const updateProducto = async (req, res) => {
    // El código del producto ahora viene de los parámetros de la URL
    const codigo = req.params.codigo; // ****** CAMBIO: Obtener código de req.params ******

    // Los demás campos vienen de req.body (parsed por Multer)
    const { inputNombre, inputStock, inputPrecio, inputStockmin } = req.body;
    
    // req.file contiene la información del archivo subido por Multer, si existe.
    // console.log('Archivo subido (si existe):', req.file); 
    // console.log('Datos del formulario:', req.body);

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

        // Si se subió un nuevo archivo, Multer ya lo manejó (sobrescribió).
        // No necesitamos hacer nada extra aquí para la imagen en la DB,
        // ya que no hay una columna de URL de imagen en la DB y la sobrescritura es el método.

        // Llamar al procedimiento almacenado para actualizar los datos del producto
        // Asegúrate de que OUTLET_Up_Producto maneje la actualización de los campos que vienen null
        // sin sobrescribir con null si no se proporcionaron.
        // O bien, puedes construir la query dinámicamente si no quieres actualizar todos los campos.
        
        // Asumiendo que OUTLET_Up_Producto solo actualiza los campos proporcionados y el resto los deja como están
        // o los actualiza a NULL si el valor es NULL.
        // Es crucial que tu procedimiento almacenado esté diseñado para un UPDATE, no un INSERT.
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

        // Puedes verificar result.rowsAffected si tu procedimiento retorna algo
        // o si es una DML statement directa (UPDATE, INSERT, DELETE)
        console.log('Resultado de la actualización:', result);
        
        // Si el procedimiento no lanza un error, asumimos éxito
        res.status(200).json({ message: 'Producto actualizado con éxito.' });

    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        // Si el error es por Multer (ej. tamaño de archivo), ya lo habría manejado Multer.
        // Aquí capturamos errores de DB o de lógica del controlador.
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