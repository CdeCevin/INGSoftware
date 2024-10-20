const express = require('express');
const { buscarProducto } = require('../Controllers/buscarProductoController');
const router = express.Router();

router.post('/', buscarProducto);

module.exports = router;
    