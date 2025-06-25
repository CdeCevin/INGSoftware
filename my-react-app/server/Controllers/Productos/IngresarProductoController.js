const multer = require('multer');
const path = require('path');
const { getConnection } = require('../../db/connection');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../', 'public', 'images', 'outlet'));
    },
    filename: (req, file, cb) => {
        const ext = '.jpg';
        const codigo = req.body['input-cod'];
        if (!codigo) {
            return cb(new Error('Product code is required for filename.'), null);
        }
        cb(null, `${codigo}${ext}`);
    },
});

const upload = multer({ storage: storage });

async function ingresarProducto(req, res) {
    const {
        'input-nombre': nombre,
        'input-cod': codigo,
        'input-stock': stock,
        'input-precio': precio,
        'input-color': color,
        'input-tipo': tipo,
        'input-stockmin': stockmin,
    } = req.body;

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
            stockmin: Number(stockmin),
        });

        await connection.commit();
        res.status(200).json({ message: 'Producto añadido correctamente' });
    } catch (error) {
        console.error('Error al insertar el producto:', error);

        let errorMessage = 'Ocurrió un error al insertar el producto. Por favor, intenta de nuevo más tarde.';
        if (error.errorNum === 20003 || error.message.includes('unique constraint')) {
             errorMessage = 'El código del producto ya está siendo utilizado.';
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

module.exports = { upload, ingresarProducto };