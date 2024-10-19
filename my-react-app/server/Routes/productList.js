const express = require('express');
const router = express.Router();
const { obtenerProductosActivos } = require('../Controllers/reporteControllers');

// Ruta para obtener todos los productos activos
router.get('/', obtenerProductosActivos);

module.exports = router;
