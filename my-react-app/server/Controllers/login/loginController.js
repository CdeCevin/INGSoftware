// controllers/loginController.js
const oracledb = require('oracledb');
const { getConnection } = require('../../db/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function login(req, res) {
  const { rut, password } = req.body;
  let conn;

  try {
    conn = await getConnection();

    const result = await conn.execute(
      `SELECT Contrasena_Usuario, ROL_Usuario, RUT_Usuario -- Agrega RUT_Usuario a la selección
       FROM OUTLET_USUARIO
       WHERE RUT_Usuario = :p_rut and ACTIVO = 1`,
      {
        p_rut: { val: Number(rut), dir: oracledb.BIND_IN, type: oracledb.NUMBER }
      },
      {
        fetchInfo: {
          "CONTRASENA_USUARIO": { type: oracledb.STRING },
          "ROL_USUARIO": { type: oracledb.STRING },
          "RUT_USUARIO": { type: oracledb.STRING } // Asegúrate de que el RUT también se traiga como string si lo necesitas así
        }
      }
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Rut o contraseña inválidos' });
    }

    const storedHash = result.rows[0][0]; // Contrasena_Usuario
    const role = result.rows[0][1];       // ROL_Usuario
    const userRutFromDB = result.rows[0][2]; // RUT_Usuario, ahora accesible

    console.log('DEBUG (Login): Rol obtenido de la DB antes de firmar JWT:', role);

    console.log('--- Debugging Login ---');
    console.log(`Usuario a logear (desde request): ${rut}`); // Este 'rut' viene del req.body
    console.log(`Contraseña (texto plano) recibida: "${password}"`);
    console.log(`Longitud contraseña recibida: ${password.length}`);
    // CORREGIDO: Usar userRutFromDB y storedHash directamente
    console.log(`Hash de la DB para ${userRutFromDB}: "${storedHash}"`);
    console.log(`Longitud del hash de DB: ${storedHash.length}`);
    const passwordMatch = await bcrypt.compare(password, storedHash);

    console.log(`Resultado de bcrypt.compare(): ${passwordMatch}`); // Mover este log aquí para que siempre se vea
    console.log('-----------------------');

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Rut o contraseña inválidos' });
    }

    const token = jwt.sign(
      { rut: Number(rut), role: role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Rol obtenido:', role);
    res.json({ token, role, rut: userRutFromDB }); // Usar userRutFromDB para consistencia si lo trajiste de la DB

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