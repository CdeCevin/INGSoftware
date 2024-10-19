const express = require('express');
const { updateProducto } = require('../Controllers/upProductoController');

const router = express.Router();

router.post('/', updateProducto);

module.exports = router;
