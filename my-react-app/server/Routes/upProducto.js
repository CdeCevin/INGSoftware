const express = require('express');
const { upload, updateProducto } = require('../Controllers/upProductoController');

const router = express.Router();

router.post('/', upload.single('input-imagen'),updateProducto);

module.exports = router;
