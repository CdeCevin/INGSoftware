const express = require('express');
const { obtenerReporteVentas, obtenerBoletaPorCodigo  } = require('../Controllers/historialVentasController');
const router = express.Router();

router.get('/historialVentas', obtenerReporteVentas);
router.get('/historialVentas/boleta/:id', obtenerBoletaPorCodigo); // Esta es la ruta para ver la boleta específica

module.exports = router;
    