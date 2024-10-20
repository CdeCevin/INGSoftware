const express = require('express');
const { buscarProducto } = require('../Controllers/buscarProductoController');
const router = express.Router();

router.get('/', buscarProducto);

module.exports = router;
    