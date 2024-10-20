const express = require('express');
const { obtenerPendientes } = require('../Controllers/pendientesController');
const router = express.Router();

router.post('/', obtenerPendientes);

module.exports = router;
    