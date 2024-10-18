// my-react-app/server/Routes/clientList.js
const express = require('express');
const router = express.Router();
const {getClients} = require('../Controllers/clientListController');

// Definir la ruta para obtener las ventas pendientes
router.get('/', getClients); // Aquí corregí el nombre del método

module.exports = router;
