const express = require('express');
const { eliminarProducto } = require('../Controllers/eliminarProductoController');
const router = express.Router();

router.post('/', eliminarProducto);

module.exports = router;
    