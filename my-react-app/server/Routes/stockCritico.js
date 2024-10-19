const express = require('express');
const { obtenerProductosBajoStock } = require('../Controllers/stockCriticoController');
const router = express.Router();

router.get('/', obtenerProductosBajoStock);

module.exports = router;
    