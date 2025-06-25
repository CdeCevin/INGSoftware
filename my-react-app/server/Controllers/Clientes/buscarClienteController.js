const oracledb = require('oracledb');
const { getConnection } = require('../../db/connection');

const buscarCliente = async (req, res) => {
    let connection;
    try {
        // Asumiendo que el único input del frontend llega como 'query' o 'valorBusqueda'
        const { valorBusqueda } = req.body; // O el nombre que uses en tu frontend
        console.log('Valor de búsqueda recibido:', valorBusqueda);

        if (!valorBusqueda) {
            return res.status(400).json({ message: 'Debe proporcionar un valor para buscar (código o nombre).' });
        }

        connection = await getConnection();
        console.log("Conexión exitosa a la base de datos");

        let bindVars = {};
        bindVars.p_clientes_cursor = { dir: oracledb.BIND_OUT, type: oracledb.CURSOR };

        // **Lógica clave: Determinar si es un número (código) o una cadena (nombre)**
        // Intentamos convertir a número y verificar si es un número válido.
        // Cuidado: parseFloat puede convertir '123abc' a 123.
        // Es mejor usar Number.isInteger para una validación estricta de enteros.
        const parsedCode = Number(valorBusqueda);
        const isNumeric = !isNaN(parsedCode) && Number.isInteger(parsedCode);

        if (isNumeric) {
            // Si es un número entero válido, lo tratamos como código
            bindVars.p_cod = parsedCode;
            bindVars.p_nombre = null;
            console.log('Interpretando como código:', parsedCode);
        } else {
            // Si no es un número, lo tratamos como nombre
            bindVars.p_cod = null;
            bindVars.p_nombre = valorBusqueda;
            console.log('Interpretando como nombre:', valorBusqueda);
        }

        // Ejecutar el procedimiento almacenado
        const result = await connection.execute(
            `BEGIN CEVIN.BUSCARCLIENTE(:p_cod, :p_nombre, :p_clientes_cursor); END;`,
            bindVars
        );

        const resultSet = result.outBinds.p_clientes_cursor;
        let clientes = [];
        let row;

        while ((row = await resultSet.getRow())) {
            clientes.push({
                activo: row[0],
                telefono: row[1],
                nombres: row[2],
                direccion: `${row[3]} #${row[4]}, ${row[5]}, ${row[6]}`
            });
        }

        await resultSet.close();

        if (clientes.length > 0) {
            // Si se buscó por código y solo se encontró un cliente, lo devolvemos como objeto.
            // Si se buscó por nombre o si por alguna razón el código retornó más de uno (aunque el SP lo evitaría),
            // devolvemos un array.
            if (isNumeric && clientes.length === 1) {
                res.status(200).json(clientes[0]);
            } else {
                res.status(200).json(clientes);
            }
        } else {
            res.status(404).json({ message: 'No se encontraron clientes con el valor de búsqueda proporcionado.' });
        }

    } catch (error) {
        console.error('Error al obtener información del cliente:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener información del cliente.', error: error.message });
    } finally {
        if (connection) {
            try {
                await connection.close();
                console.log("Conexión cerrada.");
            } catch (err) {
                console.error('Error al cerrar la conexión:', err);
            }
        }
    }
};

module.exports = { buscarCliente };