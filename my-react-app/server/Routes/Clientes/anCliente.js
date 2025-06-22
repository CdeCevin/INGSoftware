const express = require('express');
const router = express.Router();
const { insertCliente } = require('../Controllers/Clientes/anClienteController');
 
// Ruta para obtener las ventas pendientes
router.post('/', insertCliente);



module.exports = router;