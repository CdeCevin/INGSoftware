// my-react-app/server/Routes/IngresarProductos.js
const express = require('express');
const router = express.Router();
const { upload, ingresarProducto } = require('../../Controllers/Productos/IngresarProductoController');

router.post('/insertar', upload.single('input-imagen'), ingresarProducto);

module.exports = router;
