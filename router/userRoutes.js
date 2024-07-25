'use strict';
const express = require('express');
const router = express.Router();
const {create, login } = require('../controllers/userController');

//Cadastro de novo Usuário:
router.post("/", create)

// Login
router.post("/login", login);

module.exports = router