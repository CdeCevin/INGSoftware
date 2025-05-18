// controllers/anUserController.js
const oracledb        = require('oracledb');
const { getConnection } = require('../db/connection');

const updateUser = async (req, res) => {
  // Extraemos exactamente las propiedades que envía el frontend
  const { rut, INnombre, INtelefono, INtipo, INpassword } = req.body;
  console.log('Datos recibidos para actualizar:', { rut, INnombre, INtelefono, INtipo, INpassword });

  let connection;
  try {
    connection = await getConnection();

    // Llamamos al procedimiento con los binds en el orden correcto
    await connection.execute(
      `BEGIN
         OUTLET_Up_Usuario(
           :p_rut,       -- 1. Rut NUMBER
           :p_telefono,  -- 2. Telefono NUMBER
           :p_password,  -- 3. contrasena VARCHAR2
           :p_rol,       -- 4. tipo VARCHAR2
           :p_nombre     -- 5. nombre VARCHAR2
         );
       END;`,
      {
        p_rut:       { val: Number(rut),                                             dir: oracledb.BIND_IN, type: oracledb.NUMBER },
        p_telefono:  { val: INtelefono ? Number(INtelefono) : null,                   dir: oracledb.BIND_IN, type: oracledb.NUMBER },
        p_password:  { val: INpassword   !== undefined ? INpassword   : null,         dir: oracledb.BIND_IN, type: oracledb.STRING },
        p_rol:       { val: INtipo       !== undefined ? INtipo       : null,         dir: oracledb.BIND_IN, type: oracledb.STRING },
        p_nombre:    { val: INnombre     !== undefined ? INnombre     : null,         dir: oracledb.BIND_IN, type: oracledb.STRING }
      }
    );

    // Confirmamos cambios
    await connection.commit();
    res.status(200).json({ message: 'Usuario actualizado correctamente.' });

  } catch (error) {
    console.error('Error al actualizar el Usuario:', error);
    res.status(500).json({ message: 'Ocurrió un error interno al actualizar el Usuario.' });

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

module.exports = { updateUser };
