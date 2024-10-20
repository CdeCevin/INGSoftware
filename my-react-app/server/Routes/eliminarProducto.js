const express = require('express');
const { eliminarProducto } = require('../Controllers/eliminarProductoController');
const router = express.Router();

router.get('/', eliminarProducto);

module.exports = router;
    