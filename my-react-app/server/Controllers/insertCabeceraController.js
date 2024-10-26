const oracledb = require('oracledb');
const { getConnection } = require('../db/connection');



const insertCabecera = async (req, res) => {
    let connection;
    try {
        
        const { codigo } = req.body;
        console.log("Hemos llevao chavales.",codigo);
        connection = await getConnection();
        const result = await connection.execute(
            `BEGIN OUTLET_Insert_Cabecera(:c_Clientes);END;`,
            {
                c_Clientes: (codigo)
            }
        );
        
        await connection.commit();
        
        res.status(200).json({ message: 'Cabecera insertada', data: productos });
    } catch (err) {
        console.error('Error al ingresar cabecera:', err);
        res.status(500).json({ message: 'Error al ingresar cabecera.' });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};


module.exports = { insertCabecera };
