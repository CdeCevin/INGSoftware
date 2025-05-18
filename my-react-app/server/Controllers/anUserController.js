const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getConnection } = require('../db/connection');

const storage = multer.memoryStorage(); // o config personalizada
const upload = multer({ storage });

const insertUsuario = async (req, res) => {
    const { rut, nombre, telefono, tipo, password } = req.body;

    console.log('Datos recibidos en el backend:', rut, nombre, telefono, tipo);
password

    let connection;

    try {
        connection = await getConnection();
        
        await connection.execute(
            `BEGIN OUTLET_Insert_User(:Rut_Usuario, :Nombre_Usuario, :Contrasena_Usuario, :Telefono_Usuario, :Rol_Usuario); END;`,
            {
                Rut_Usuario: Number(rut),
                Nombre_Usuario: nombre,
                Contrasena_Usuario: password,
                Telefono_Usuario: Number(telefono),
                Rol_Usuario: tipo
            }
        );

        await connection.commit();
        res.status(200).json({ message: 'Usuario añadido correctamente' });

    } catch (error) {
        console.error('Error al insertar el Usuario:', error);

        let errorMessage = 'Ocurrió un error al insertar el Usuario.';
        res.status(500).json({ message: errorMessage });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err.message);
            }
        }
    }
};

module.exports = { insertUsuario };