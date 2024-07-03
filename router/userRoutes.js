'use strict';
const express = require('express');
const router = express.Router();
const {sessao, create, login, logout} = require('../controllers/userController');

//Continuando sessao
router.get('/session', sessao)

//Cadastro de novo Usuário:
router.post("/", create)

// Login
router.post("/login", login);

// Logout
router.get( "/logout", logout)

module.exports = router