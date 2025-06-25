const oracledb = require('oracledb');
const path = require('path');
const { getConnection } = require('../../db/connection'); 
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });


const eliminarUsuario = async (req, res) => {
    let connection;
    try {
        const { Rut_Usuario } = req.body;
        const RUT_SUPER_ADMIN_INAMOVIBLE = process.env.RUT_SUPER_ADMIN;


        if (String(Rut_Usuario) === RUT_SUPER_ADMIN_INAMOVIBLE) {
            console.warn(`Intento de eliminar el RUT del Super Admin: ${Rut_Usuario}`);
            return res.status(409).json({ message: 'Este usuario no puede ser eliminado.' });
        }

        console.log('RUT de usuario recibido desde el frontend para eliminación:', Rut_Usuario);

        connection = await getConnection();
        await connection.execute(
            `BEGIN OUTLET_Eliminar_User(:p_Rut_Usuario); END;`,
            {
                p_Rut_Usuario: parseInt(Rut_Usuario) 
            },
            { autoCommit: true } 
        );

        res.status(200).json({ message: 'Usuario eliminado correctamente.' });

    } catch (err) {
        console.error('Error al eliminar Usuario:', err);
        if(err.errorNum === 2002) {
            return res.status(400).json({ message: 'Usuario ya eliminado.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al eliminar el Usuario.' });
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

module.exports = { eliminarUsuario };