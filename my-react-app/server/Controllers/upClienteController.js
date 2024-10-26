const oracledb = require('oracledb');
const { getConnection } = require('../db/connection');

const updateCliente = async (req, res) => {
    console.log("Entrando al updateClient");
    const { cod, INnombre, INtelefono, INregion, INciudad, INcalle, INnumero} = req.body;
    console.log(cod, INnombre, telefono, region, ciudad, calle,numero);

    let connection;
    try {
        connection = await getConnection();

        // Convertir valores a `null` cuando sea necesario
        const codigo = (cod);
        const nombre = INnombre ? (INnombre) : null;
        const telefono = (INtelefono) ? (INtelefono) : null;
        const region = INregion ? (INregion) : null;
        const ciudad = INciudad ? (INciudad) : null;
        const calle = INcalle ? (INcalle) : null;
        const numero = INnumero ? (INnumero) : null;

        // Llamar al procedimiento almacenado
        const result = await connection.execute(
            `BEGIN OUTLET_Up_Client(:calle, :numero, :ciudad, :nombre, :cod, :telefono); END;`,
            {

                calle,
                numero,
                ciudad,
                nombre,
                cod,
                telefono,
            }
        );

        res.status(200).json({ message: 'Producto actualizado con éxito.' });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
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

module.exports = { updateCliente };
