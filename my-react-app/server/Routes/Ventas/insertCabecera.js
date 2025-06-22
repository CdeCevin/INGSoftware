const express = require('express');
const router = express.Router();
const { insertCabecera } = require('../../Controllers/Ventas/insertCabeceraController');

router.post('/', insertCabecera);



module.exports = router;
