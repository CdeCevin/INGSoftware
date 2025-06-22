const oracledb = require('oracledb');
const { getConnection } = require('.../db/connection');

const buscarCliente = async (req, res) => {
  let connection;
  try {
      const { codigo } = req.body;
      console.log('Código del cliente recibido:', codigo);

      connection = await getConnection();
      console.log("Conexión exitosa a la base de datos");

      const result = await connection.execute(
          `BEGIN ObtenerInformacionCliente(:p_cod, :p_Activo, :o_Telefono, :o_Nombres, :o_NombreCalle, :o_NumeroDireccion, :o_NombreCiudad, :o_NombreRegion); END;`,
          {
              p_cod: codigo,
              p_Activo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
              o_Telefono: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 255 },
              o_Nombres: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 255 },
              o_NombreCalle: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 255 },
              o_NumeroDireccion: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 255 },
              o_NombreCiudad: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 255 },
              o_NombreRegion: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 255 }
          }
      );

      const { p_Activo, o_Telefono, o_Nombres, o_NombreCalle, o_NumeroDireccion, o_NombreCiudad, o_NombreRegion } = result.outBinds;

      if (p_Activo === 1) {
          res.status(200).json({
              nombres: o_Nombres, // Cambiado a "nombres"
              telefono: o_Telefono,
              direccion: `${o_NombreCalle} #${o_NumeroDireccion}, ${o_NombreCiudad}, ${o_NombreRegion}`
          });
      } else {
          res.status(404).json({ message: 'Cliente no encontrado.' });
      }

  } catch (error) {
      console.error('Error al obtener información del cliente:', error);
      res.status(500).json({ message: 'Error al obtener información del cliente.' });
  } finally {
      if (connection) await connection.close();
  }
};


module.exports = { buscarCliente };
