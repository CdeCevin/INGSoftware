const express = require('express');
const {
  obtenerVentasMensuales,
  obtenerTopProductos,
  obtenerProductosMenosVendidos,
} = require('../../Controllers/Reportes/reporteController'); // Asegúrate de importar todas las funciones

const router = express.Router();

// Endpoint para obtener ventas mensuales
router.get('/ventas-mensuales', obtenerVentasMensuales);

// Endpoint para obtener los productos más vendidos
router.get('/top-productos', obtenerTopProductos);

// Endpoint para obtener los productos menos vendidos
router.get('/menos-vendidos', obtenerProductosMenosVendidos);

module.exports = router;
