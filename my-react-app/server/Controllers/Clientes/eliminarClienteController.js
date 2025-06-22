const oracledb = require('oracledb');
const { getConnection } = require('../../db/connection'); // Importa correctamente

const eliminarCliente = async (req, res) => {
  let connection;
  try {
    const { codigo } = req.body;

    // Verifica que el código no sea indefinido
    console.log('Código recibido desde el frontend:', codigo);
    
    // Establece la conexión
    connection = await getConnection(); // Llama a la función de conexión

    // Ejecuta el procedimiento almacenado
    await connection.execute(
      `BEGIN OUTLET_Elim_Client(:p_codigo); END;`,
      {
        p_codigo: parseInt(codigo) // Asegúrate de que el código sea un número
      }
    );

    await connection.commit();

    res.status(200).json({ message: 'Cliente eliminado correctamente.' });
  } catch (err) {
    console.error('Error al eliminar producto:', err);
    res.status(500).json({ message: 'Error al eliminar el cliente.' });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

module.exports = { eliminarCliente };
