const express = require('express');
const router = express.Router();
const { boleta } = require('../Controllers/boletaController');
 
// Ruta para obtener las ventas pendientes
router.post('/', boleta);



module.exports = router;
