// my-react-app/server/Routes/IngresarProductos.js
const express = require('express');
const router = express.Router();
const {insertUsuario} = require('../Controllers/anUserController'); // Asegúrate de que la ruta sea correcta

router.use('/', insertUsuario); // Usar el controlador

module.exports = router;
