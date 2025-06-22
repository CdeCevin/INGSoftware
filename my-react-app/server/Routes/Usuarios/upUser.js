const express = require('express');
const { updateUser } = require('../../Controllers/upUserController');

const router = express.Router();

router.post('/', updateUser);

module.exports = router;
