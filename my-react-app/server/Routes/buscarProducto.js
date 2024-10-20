const express = require('express');
const { buscarProducto } = require('../Controllers/ProductoController');
const router = express.Router();

router.post('/', buscarProducto);

module.exports = router;
    