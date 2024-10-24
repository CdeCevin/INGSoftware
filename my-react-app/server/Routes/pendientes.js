const express = require('express');
const router = express.Router();
const { obtenerPendientes, cancelarPendiente, realizarPendiente } = require('../Controllers/pendientesController');

// Ruta para obtener las ventas pendientes
router.get('/pendientes', obtenerPendientes);

// Ruta para cancelar una venta pendiente
router.post('/cancelar', cancelarPendiente);

// Ruta para realizar una venta pendiente
router.post('/realizar', realizarPendiente);

module.exports = router;
