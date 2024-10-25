const express = require('express');
const router = express.Router();
const { insertarCabecera } = require('../Controllers/insertCabeceraController');

// Ruta para obtener las ventas pendientes
router.get('/', insertarCabecera);



module.exports = router;
