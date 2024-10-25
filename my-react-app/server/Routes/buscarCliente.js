const express = require('express');
const router = express.Router();
const { buscarCliente } = require('../Controllers/buscarClienteController');

// Ruta para obtener las ventas pendientes
router.post('/', buscarCliente);



module.exports = router;
