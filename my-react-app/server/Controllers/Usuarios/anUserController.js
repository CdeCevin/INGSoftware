// Controllers/anUserController.js
const { getConnection } = require('../../db/connection');
const bcrypt = require('bcrypt'); // Importar bcrypt

const saltRounds = 12; // Número de rondas de sal para bcrypt (un valor seguro es 10-12)

const insertUsuario = async (req, res) => {
  const { INRut, INnombre, INpassword, INtelefono, INRol } = req.body;

  console.log('Datos recibidos en el backend:', {
    INRut, INnombre, INpassword, INtelefono, INRol
  });

  let conn;
  try {
    // 1. Hashear la contraseña antes de enviarla a la base de datos
    const hashedPassword = await bcrypt.hash(INpassword, saltRounds);
    console.log('Contraseña hasheada:', hashedPassword); // Para depuración, puedes eliminar esto después

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
        // 2. Usar la contraseña hasheada en lugar de la original
        Contrasena_Usuario: hashedPassword,
        Telefono_Usuario: Number(INtelefono),
        Rol_Usuario: INRol
      }
    );
    await conn.commit();
    res.status(200).json({ message: 'Usuario añadido correctamente' });
  } catch (err) {
    console.error('Error al insertar el Usuario:', err);
           if(err.errorNum === 20002) {
            return res.status(400).json({ message: 'Usuario ya existe en la base de datos' });
        }
        else{
        res.status(500).json({ message: 'Error interno del servidor al crear el Usuario.' });
        }
    if (conn) await conn.close();
  }
};

module.exports = { insertUsuario };