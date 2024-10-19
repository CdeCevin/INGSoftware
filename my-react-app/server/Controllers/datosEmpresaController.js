const oracledb = require('oracledb');
const connection = require('../db/connection');

const obtenerInformacionCliente = async (req, res) => {

  try {
    const conn = await connection.getConnection();

    const result = await conn.execute(
      `BEGIN
        ObtenerInformacionCliente(
          :p_cod,
          :o_activo,
          :o_Telefono,
          :o_Nombres,
          :o_NombreCalle,
          :o_NumeroDireccion,
          :o_NombreCiudad,
          :o_NombreRegion
        );
      END;`,
      {
        p_cod: 0,
        o_activo: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        o_Telefono: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        o_Nombres: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        o_NombreCalle: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        o_NumeroDireccion: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        o_NombreCiudad: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        o_NombreRegion: { type: oracledb.STRING, dir: oracledb.BIND_OUT }
      }
    );

    console.log("Datos obtenidos del procedimiento almacenado:");
    console.log("Telefono:", result.outBinds.o_Telefono);
    console.log("Nombre:", result.outBinds.o_Nombres);
    console.log("Calle:", result.outBinds.o_NombreCalle);
    console.log("Número de dirección:", result.outBinds.o_NumeroDireccion);
    console.log("Ciudad:", result.outBinds.o_NombreCiudad);
    console.log("Región:", result.outBinds.o_NombreRegion);
    console.log("Activo:", result.outBinds.o_activo);

    // Formatear los resultados y enviarlos como respuesta
    res.json({
      telefono: result.outBinds.o_Telefono,
      nombre: result.outBinds.o_Nombres,
      nombreCalle: result.outBinds.o_NombreCalle,
      numeroDireccion: result.outBinds.o_NumeroDireccion,
      nombreCiudad: result.outBinds.o_NombreCiudad,
      nombreRegion: result.outBinds.o_NombreRegion,
      activo: result.outBinds.o_activo
    });
  } catch (err) {
    console.error('Error al obtener la información del cliente:', err);
    res.status(500).json({ error: 'Error al obtener la información del cliente' });
  }
};

module.exports = { obtenerInformacionCliente };
