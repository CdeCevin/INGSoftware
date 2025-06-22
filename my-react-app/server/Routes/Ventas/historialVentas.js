const express = require('express');
const { obtenerReporteVentas, obtenerBoletaPorCodigo  } = require('../../Controllers/Ventas/historialVentasController');
const router = express.Router();

router.get('/historialVentas', obtenerReporteVentas);
router.get('/boleta/:id', obtenerBoletaPorCodigo); // Esta es la ruta para ver la boleta específica

module.exports = router;
    