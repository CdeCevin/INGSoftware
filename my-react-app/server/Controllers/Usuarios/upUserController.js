// controllers/upUserController.js
const oracledb = require('oracledb');
const { getConnection } = require('../../db/connection');
const bcrypt = require('bcrypt');

const saltRounds = 12;

const updateUser = async (req, res) => {
  const { rut, INnombre, INtelefono, INtipo, INpassword } = req.body;
  console.log('Datos recibidos para actualizar:', { rut, INnombre, INtelefono, INtipo, INpassword });

  let connection;
  let hashedPassword = null;

  try {
    if (INpassword !== undefined && INpassword !== null && INpassword.trim() !== '') {
      hashedPassword = await bcrypt.hash(INpassword, saltRounds);
      console.log('Nueva contraseña hasheada para actualización:', hashedPassword);
    }

    connection = await getConnection();

    await connection.execute(
      `BEGIN
         OUTLET_Up_Usuario(
           :p_rut,
           :p_telefono,
           :p_password,
           :p_rol,
           :p_nombre
         );
       END;`,
      {
        p_rut: { val: Number(rut), dir: oracledb.BIND_IN, type: oracledb.NUMBER },
        p_telefono: { val: INtelefono ? Number(INtelefono) : null, dir: oracledb.BIND_IN, type: oracledb.NUMBER },
        p_password: { val: hashedPassword, dir: oracledb.BIND_IN, type: oracledb.STRING },
        p_rol: { val: INtipo && INtipo.trim() !== '' ? INtipo : null, dir: oracledb.BIND_IN, type: oracledb.STRING },
        p_nombre: { val: INnombre && INnombre.trim() !== '' ? INnombre : null, dir: oracledb.BIND_IN, type: oracledb.STRING }
      }
    );

    await connection.commit();
    res.status(200).json({ message: 'Usuario actualizado correctamente.' });

  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
      if(error.errorNum === 20002) {
          return res.status(400).json({ message: 'Error interno del servidor, el usuario no existe.' });
      }
      else{
      res.status(500).json({ message: 'Error interno del servidor.' });
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

module.exports = { updateUser };