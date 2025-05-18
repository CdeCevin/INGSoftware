// Controllers/anUserController.js
const { getConnection } = require('../db/connection');

const insertUsuario = async (req, res) => {
  const { INRut, INnombre, INpassword, INtelefono, INRol } = req.body;

  console.log('Datos recibidos en el backend:', {
    INRut, INnombre, INpassword, INtelefono, INRol
  });

  let conn;
  try {
    conn = await getConnection();
    await conn.execute(
      `BEGIN OUTLET_Insert_User(
         :Rut_Usuario,
         :Nombre_Usuario,
         :Contrasena_Usuario,
         :Telefono_Usuario,
         :Rol_Usuario
       ); END;`,
      {
        Rut_Usuario: Number(INRut),
        Nombre_Usuario: INnombre,
        Contrasena_Usuario: INpassword,
        Telefono_Usuario: Number(INtelefono),
        Rol_Usuario: INRol
      }
    );
    await conn.commit();
    res.status(200).json({ message: 'Usuario añadido correctamente' });
  } catch (err) {
    console.error('Error al insertar el Usuario:', err);
    res.status(500).json({ message: 'Ocurrió un error al insertar el Usuario.' });
  } finally {
    if (conn) await conn.close();
  }
};

module.exports = { insertUsuario };
