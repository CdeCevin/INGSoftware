const express = require('express');
const router = express.Router();
const { getProducts } = require('../../Controllers/Productos/productListController'); // Asegúrate de que esta línea sea correcta
// Define la ruta para obtener los productos
router.get('/', getProducts); // Esta ruta llamará al controlador getProducts

module.exports = router;
