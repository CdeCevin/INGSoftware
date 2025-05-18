const oracledb = require('oracledb');
const { getConnection } = require('../db/connection'); // Importa correctamente

const eliminarUsuario = async (req, res) => {
  let connection;
  try {
    const { Rut_Usuario } = req.body;

    // Verifica que el código no sea indefinido
    console.log('Código recibido desde el frontend:', Rut_Usuario);
    
    // Establece la conexión
    connection = await getConnection(); // Llama a la función de conexión

    // Ejecuta el procedimiento almacenado
    await connection.execute(
      `BEGIN OUTLET_Eliminar_User(:p_Rut_Usuario); END;`,
      {
        p_Rut_Usuario: parseInt(Rut_Usuario) // Asegúrate de que el código sea un número
      }
    );

    await connection.commit();

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

module.exports = { eliminarUsuario };
