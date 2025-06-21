
//PROBANDO PROBANDO 1 2 3  1 2 3 
const express = require('express');
// Asegúrate de que 'path' esté importado si no lo está, ya que se usa en el controlador para Multer
const path = require('path'); 
const { upload, updateProducto } = require('../Controllers/upProductoController');

const router = express.Router();
// La ruta ahora espera el código del producto en la URL
// El middleware 'upload.single' debe ir ANTES del controlador 'updateProducto'
router.put('/:codigo', upload.single('input-imagen'), updateProducto);

module.exports = router;