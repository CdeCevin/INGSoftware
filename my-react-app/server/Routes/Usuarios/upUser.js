const express = require('express');
const { updateUser } = require('../../Controllers/Usuarios/upUserController');

const router = express.Router();

router.post('/', updateUser);

module.exports = router;
