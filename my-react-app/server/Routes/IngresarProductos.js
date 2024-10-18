// my-react-app/server/Routes/IngresarProductos.js
const express = require('express');
const router = express.Router();
const ingresarProductoController = require('../Controllers/IngresarProductoController');

router.use('/', ingresarProductoController); // Usar el controlador

module.exports = router;
