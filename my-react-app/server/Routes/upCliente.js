const express = require('express');
const { updateCliente } = require('../Controllers/upClienteController');

const router = express.Router();

router.post('/', updateCliente);

module.exports = router;
