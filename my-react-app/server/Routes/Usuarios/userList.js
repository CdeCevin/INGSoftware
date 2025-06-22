// routes/usuarios.js
const express = require('express');
const router = express.Router();
const { getUsuarios } = require('../../controllers/Usuarios/userListController');

router.get('/', getUsuarios);

module.exports = router;
