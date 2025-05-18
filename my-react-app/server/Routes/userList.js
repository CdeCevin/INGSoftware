// routes/usuarios.js
const express = require('express');
const router = express.Router();
const { getUsuarios } = require('../controllers/userController');

router.get('/', getUsuarios);

module.exports = router;
