const express = require('express');
const router = express.Router();
const { boleta } = require('../../Controllers/Ventas/boletaController');
 
// Ruta para obtener las ventas pendientes
router.get('/', boleta);



module.exports = router;
