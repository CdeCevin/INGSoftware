// routes/auth.js
const express = require('express');
const router  = express.Router();
const { login } = require('../../Controllers/login/Controller');
router.post('/', express.json(), login);
module.exports = router;
