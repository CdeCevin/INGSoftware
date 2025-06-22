const express = require('express');
const router = express.Router();
const { obtenerInformacionCliente } = require('../../Controllers/Empresa/datosEmpresaController');

// Definir ruta para obtener información del cliente por ID
router.get('/', obtenerInformacionCliente);

module.exports = router;
