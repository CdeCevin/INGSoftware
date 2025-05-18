// controllers/userController.js
const oracledb = require('oracledb');
const { getConnection } = require('../db/connection');

async function getUsuarios(req, res) {
  let conn;
  try {
    conn = await getConnection();

    // Llamada al procedimiento con un cursor OUT
    const result = await conn.execute(
      `BEGIN
         Outlet_FiltrarUsuarios(:c_Usuarios);
       END;`,
      {
        c_Usuarios: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
      }
    );

    const cursor = result.outBinds.c_Usuarios;
    const rows = await cursor.getRows(); // array de filas, cada fila es array de columnas
    await cursor.close();

    // Mapear cada fila a un objeto con propiedades claras
    const usuarios = rows.map(r => ({
      RUT:        r[0],
      Telefono:   r[1],
      Nombre:     r[2],
      Tipo:       r[3]
    }));

    res.json(usuarios);

  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ message: 'Error obteniendo usuarios.' });
  } finally {
    if (conn) {
      try { await conn.close(); }
      catch (_) { /* ignore */ }
    }
  }
}

module.exports = { getUsuarios };
