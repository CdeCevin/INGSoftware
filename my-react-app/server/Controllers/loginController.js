// controllers/authController.js
const oracledb = require('oracledb');
const { getConnection } = require('../db/connection');
const bcrypt = require('bcrypt'); // Asegúrate de tener 'npm install bcrypt'

async function login(req, res) {
  const { rut, password } = req.body;
  let conn;

  try {
    conn = await getConnection();

    // 1. Consulta directamente el hash de la contraseña y el rol del usuario desde la tabla.
    // No usamos un procedimiento PL/SQL para esto.
    const result = await conn.execute(
      `SELECT Contrasena_Usuario, ROL_Usuario
       FROM OUTLET_USUARIO
       WHERE RUT_Usuario = :p_rut`,
      {
        p_rut: { val: Number(rut), dir: oracledb.BIND_IN, type: oracledb.NUMBER }
      },
      // Esto es para asegurar que los datos se recuperen como string de Node.js
      {
        fetchInfo: {
          "CONTRASENA_USUARIO": { type: oracledb.STRING },
          "ROL_USUARIO": { type: oracledb.STRING }
        }
      }
    );

    // 2. Si no se encuentra ninguna fila, el usuario no existe.
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Rut o contraseña inválidos' });
    }

    // 3. Extrae el hash almacenado y el rol de la base de datos.
    const storedHash = result.rows[0][0]; // Contraseña hasheada
    const role = result.rows[0][1];       // Rol del usuario

    // 4. Compara la contraseña en texto plano (ingresada por el usuario) con el hash almacenado.
    // Esta comparación la hace bcrypt en Node.js, no en la base de datos.
    const passwordMatch = await bcrypt.compare(password, storedHash);

    // 5. Si las contraseñas no coinciden, la autenticación falla.
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Rut o contraseña inválidos' });
    }

    // 6. Si todo es correcto, el usuario está autenticado.
    console.log('Rol obtenido:', role);
    res.json({ role, rut }); // Envía el rol y el rut al frontend

  } catch (err) {
    console.error('Error durante el proceso de login:', err);
    res.status(500).json({ message: 'Ocurrió un error interno al autenticar.' });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error('Error al cerrar la conexión de la base de datos:', err);
      }
    }
  }
}

module.exports = { login };