const express = require('express');
const { obtenerPendientes } = require('../Controllers/pendientesController');
const router = express.Router();

router.get('/', obtenerPendientes);

module.exports = router;
    