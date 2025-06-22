const express = require('express');
const { updateCliente } = require('../Controllers/Clientes/upClienteController');

const router = express.Router();

router.post('/', updateCliente);

module.exports = router;
