const express = require('express');
const { upEmpresa } = require('../../Controllers/Empresa/upEmpresaController');

const router = express.Router();

router.post('/', upEmpresa);

module.exports = router;
