// routes/auth.js
const express = require('express');
const router  = express.Router();
const { login } = require('../../Controllers/login/loginController');
router.post('/', express.json(), login);
module.exports = router;
