const express = require('express');
const router = express.Router();
const { insertCabecera } = require('../Controllers/insertCabeceraController');

router.post('/', insertCabecera);



module.exports = router;
