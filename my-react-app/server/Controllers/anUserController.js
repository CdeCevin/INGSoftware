const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getConnection } = require('../db/connection');

const storage = multer.memoryStorage(); // o config personalizada
const upload = multer({ storage });

const insertUsuario = async (req, res) => {
    const { INRut, INnombre, INpassword, INtelefono, INRol } = req.body;

    console.log('Datos recibidos en el backend:', INRut, INnombre, INpassword, INtelefono, INRol);


    let connection;

    try {
        connection = await getConnection();
        
        await connection.execute(
            `BEGIN OUTLET_Insert_User(:Rut_Usuario, :Nombre_Usuario, :Contrasena_Usuario, :Telefono_Usuario, :Rol_Usuario); END;`,
            {
                Rut_Usuario: Number(INRut),
                Nombre_Usuario: INnombre,
                Contrasena_Usuario: INpassword,
                Telefono_Usuario: Number(INtelefono),
                Rol_Usuario: INRol
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