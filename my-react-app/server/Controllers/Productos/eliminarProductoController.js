// CdeCevin/INGSoftware/my-react-app/server/Controllers/Productos/eliminarProductoController.js

const oracledb = require('oracledb');
const path = require('path'); // ¡Necesitamos 'path' para construir la ruta del archivo!
const fs = require('fs').promises; // Usamos la versión de promesas de 'fs' para operaciones asíncronas
const { getConnection } = require('../../db/connection'); // Importa correctamente

const eliminarProducto = async (req, res) => {
  let connection;
  try {
    const { codigo } = req.body; 

  
    if (isNaN(Number(codigo))) {
        return res.status(400).json({ message: 'El código del producto debe ser un número válido.' });
    }

    const imageFileName = `${codigo}.jpg`; 

    const imagePath = path.join(__dirname, '../../', 'public', 'images', 'outlet', imageFileName);

    try {
        await fs.unlink(imagePath); // Intenta eliminar el archivo
    } catch (err) {

        if (err.code === 'ENOENT') {
      
            console.warn(`Advertencia: La imagen ${imageFileName} no se encontró en el servidor.`);
        } else {
            console.error(`Error al eliminar la imagen ${imageFileName}:`, err);
        }
    }

    // Establece la conexión
    connection = await getConnection(); // Llama a la función de conexión

    // Ejecuta el procedimiento almacenado para eliminar el producto de la DB
    await connection.execute(
      `BEGIN OUTLET_Elim_Producto(:p_codigo); END;`,
      {
        p_codigo: parseInt(codigo) // Asegúrate de que el código sea un número
      },
      { autoCommit: true } // Confirmar la transacción
    );

    res.status(200).json({ message: 'Producto eliminado correctamente.' });
  } catch (err) {
    console.error('Error al eliminar producto:', err);
    if(err.errorNum === 20002) {
      return res.status(400).json({ message: 'Producto  ya eliminado.' });
    }
    else{
    res.status(500).json({ message: 'Error interno del servidor al eliminar el Producto.' });
    }
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

module.exports = { eliminarProducto };