const express = require('express');
const router = express.Router();
const { insertCuerpo } = require('../Controllers/insertCuerpoController');

router.post('/', insertCuerpo);



module.exports = router;
