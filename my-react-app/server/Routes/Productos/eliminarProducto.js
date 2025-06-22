const express = require('express');
const { eliminarProducto } = require('../../Controllers/Productos/eliminarProductoController');
const router = express.Router();

router.post('/', eliminarProducto);

module.exports = router;
    