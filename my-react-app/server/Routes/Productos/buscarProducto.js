const express = require('express');
const { buscarProducto } = require('../../Controllers/Productos/buscarProductoController');
const router = express.Router();

router.post('/', buscarProducto);

module.exports = router;
    