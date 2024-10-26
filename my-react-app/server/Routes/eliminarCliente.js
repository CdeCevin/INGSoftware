const express = require('express');
const router = express.Router();
const { eliminarCliente } = require('../Controllers/eliminarClienteController');
 
// Ruta para obtener las ventas pendientes
router.post('/', eliminarCliente);



module.exports = router;
