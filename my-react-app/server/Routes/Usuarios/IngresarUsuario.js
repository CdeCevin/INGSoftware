// server/Routes/IngresarProductos.js
const express = require('express');
const multer = require('multer');
const router = express.Router();

// Definimos multer aquí
const storage = multer.memoryStorage();
const upload  = multer({ storage });

const { insertUsuario } = require('../../Controllers/Usuarios/anUserController');

// Ahora sí importamos upload.none()
router.post('/', upload.none(), insertUsuario);

module.exports = router;
