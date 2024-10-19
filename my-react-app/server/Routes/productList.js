const express = require('express');
const router = express.Router();
const { getProductList } = require('../Controllers/productListController');

// Ruta para obtener la lista de productos
router.get('/', getProductList);

module.exports = router;
