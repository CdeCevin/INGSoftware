// controllers/loginController.js
const oracledb = require('oracledb');
const { getConnection } = require('../db/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // <-- Agrega esta línea para importar jsonwebtoken
require('dotenv').config(); // <-- Agrega esta línea para cargar las variables de entorno (como JWT_SECRET)

async function login(req, res) {
  const { rut, password } = req.body;
  let conn;

  try {
    conn = await getConnection();

    const result = await conn.execute(
      `SELECT Contrasena_Usuario, ROL_Usuario
       FROM OUTLET_USUARIO
       WHERE RUT_Usuario = :p_rut`,
      {
        p_rut: { val: Number(rut), dir: oracledb.BIND_IN, type: oracledb.NUMBER }
      },
      {
        fetchInfo: {
          "CONTRASENA_USUARIO": { type: oracledb.STRING },
          "ROL_USUARIO": { type: oracledb.STRING }
        }
      }
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Rut o contraseña inválidos' });
    }

    const storedHash = result.rows[0][0];
    const role = result.rows[0][1];

    const passwordMatch = await bcrypt.compare(password, storedHash);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Rut o contraseña inválidos' });
    }

    // --- NUEVO: Generar un JWT al autenticar exitosamente ---
    const token = jwt.sign(
      { rut: Number(rut), role: role }, // Payload: Información que quieres almacenar en el token
      process.env.JWT_SECRET,           // Clave secreta para firmar el token (desde .env)
      { expiresIn: '1h' }               // Opcional: el token expirará en 1 hora
    );
    // --------------------------------------------------------

    console.log('Rol obtenido:', role);
    // --- MODIFICADO: Envía el token, el rol y el rut al frontend ---
    res.json({ token, role, rut }); 

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