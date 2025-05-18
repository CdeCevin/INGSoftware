// controllers/anUserController.js
const oracledb      = require('oracledb');
const { getConnection } = require('../db/connection');

const updateUser = async (req, res) => {
  // 1) Extrae exactamente esas cinco propiedades
  const { rut, INnombre, INtelefono, INtipo, INpassword } = req.body;
  console.log('Datos recibidos para actualizar:', { rut, INnombre, INtelefono, INtipo, INpassword });

  let connection;
  try {
    connection = await getConnection();

    // 2) Llama a tu procedimiento PL/SQL con los binds que necesita
    await connection.execute(
      `BEGIN
         OUTLET_Up_Usuario(
           :p_rut,
           :p_telefono,
           :p_password,
           :p_rol,
           :p_nombre,
           
         );
       END;`,
      {
        p_rut:      { val: Number(rut),      dir: oracledb.BIND_IN, type: oracledb.NUMBER }, 
        p_telefono: { val: Number(INtelefono), dir: oracledb.BIND_IN, type: oracledb.NUMBER },
        p_password: { val: INpassword,       dir: oracledb.BIND_IN, type: oracledb.STRING },
        p_rol:      { val: INtipo,           dir: oracledb.BIND_IN, type: oracledb.STRING },
        p_nombre:   { val: INnombre,         dir: oracledb.BIND_IN, type: oracledb.STRING }
      }
    );

    await connection.commit();
    res.status(200).json({ message: 'Usuario actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar el Usuario:', error);
    res.status(500).json({ message: 'Ocurrió un error interno al actualizar el Usuario.' });
  } finally {
    if (connection) {
      try { await connection.close(); }
      catch (err) { console.error('Error cerrando la conexión:', err); }
    }
  }
};

module.exports = { updateUser };
