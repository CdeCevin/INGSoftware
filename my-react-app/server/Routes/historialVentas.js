const express = require('express');
const { obtenerReporteVentas } = require('../Controllers/historialVentasController');
const router = express.Router();

router.get('/historialVentas', obtenerReporteVentas);

module.exports = router;
    