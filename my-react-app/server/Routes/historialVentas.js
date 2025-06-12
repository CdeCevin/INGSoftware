// Routes/historialVentas.js
const express = require('express');
const { obtenerReporteVentas, obtenerBoletaPorCodigo } = require('../Controllers/historialVentasController');
const router = express.Router();

router.get('/', obtenerReporteVentas); // Ruta para /api/historialVentas
router.get('/boleta/:id', obtenerBoletaPorCodigo); // Ruta para /api/historialVentas/boleta/:id

module.exports = router;