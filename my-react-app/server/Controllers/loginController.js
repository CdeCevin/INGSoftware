// controllers/authController.js
const oracledb        = require('oracledb');
const { getConnection } = require('../db/connection');

async function login(req, res) {
  const { rut, password } = req.body;
  let conn;

  try {
    conn = await getConnection();
    const result = await conn.execute(
      `BEGIN
         OUTLET_Auth_User(:p_rut, :p_pass, :p_role);
       END;`,
      {
        p_rut:  { val: Number(rut), dir: oracledb.BIND_IN,  type: oracledb.NUMBER },
        p_pass: { val: password,   dir: oracledb.BIND_IN,  type: oracledb.STRING },
        p_role: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 15 }
      }
    );

    const role = result.outBinds.p_role; // Ya no necesitas la coma aquí
    
    console.log('Rol obtenido:', role);
    if (!role) {
      return res.status(401).json({ message: 'Rut o contraseña inválidos' });
    }

    // Opcional: podrías generar un JWT aquí e incluir el role en el payload
    // ¡CORRECCIÓN AQUÍ! Envía tanto el rol como el rut en un solo objeto
    res.json({ role, rut }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error interno al autenticar' });
  } finally {
    if (conn) {
      try { 
        await conn.close(); 
      } catch (err) {
        console.error('Error al cerrar la conexión:', err); // Agrega un manejo de error para el cierre
      }
    }
  }
}

module.exports = { login };