const express = require('express');
const router = express.Router();
const { obtenerPendientes, cancelarPendiente, realizarPendiente } = require('../Controllers/pendientesController');

// Ruta para obtener las ventas pendientes
router.get('/', obtenerPendientes);

// Ruta para cancelar una venta pendiente
router.get('/cancelar', cancelarPendiente);

// Ruta para realizar una venta pendiente
router.post('/realizar', realizarPendiente);

module.exports = router;
