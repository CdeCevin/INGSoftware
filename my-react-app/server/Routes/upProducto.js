const express = require('express');
const { updateProducto } = require('../Controllers/upProductoController');

const router = express.Router();

router.post('/up_producto', updateProducto);

module.exports = router;
