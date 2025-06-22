const express = require('express');
const router = express.Router();
const { insertCuerpo } = require('../../Controllers/Ventas/insertCuerpoController');

router.post('/', insertCuerpo);



module.exports = router;
