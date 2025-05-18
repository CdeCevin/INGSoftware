// my-react-app/server/Routes/IngresarProductos.js
const express = require('express');
const router = express.Router();
const {insertCliente} = require('../Controllers/anUserController'); // Asegúrate de que la ruta sea correcta

router.use('/', insertCliente); // Usar el controlador

module.exports = router;
