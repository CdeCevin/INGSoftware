const express = require('express');
const router = express.Router();
const { insertarCabecera } = require('../Controllers/insertCabeceraController');

router.post('/', insertarCabecera);



module.exports = router;
