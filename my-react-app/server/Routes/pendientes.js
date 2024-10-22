const express = require('express');
const router = express.Router();
const { obtenerPendientes, cancelarPendiente, realizarPendiente } = require('../Controllers/pendientesController');

// Ruta para obtener las ventas pendientes
router.get('/', obtenerPendientes);

// Ruta para cancelar una venta pendiente
router.delete('/cancelar/:idVenta', cancelarPendiente);

// Ruta para realizar una venta pendiente
router.put('/realizar/:idVenta', realizarPendiente);

module.exports = router;
