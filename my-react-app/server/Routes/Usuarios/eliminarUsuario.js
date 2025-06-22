const express = require('express');
const { eliminarUsuario } = require('../../Controllers/Usuarios/eliminarUsuarioController');
const router = express.Router();

router.post('/', eliminarUsuario);

module.exports = router;
    