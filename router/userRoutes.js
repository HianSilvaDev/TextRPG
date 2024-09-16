"use strict";
const express = require("express");
const router = express.Router();
const { create, login, deleteUser } = require("../controllers/userController");

//Cadastro de novo Usuário:
router.post("/", create);

// Login
router.post("/login", login);

// Login
router.delete("/delete/:id", deleteUser);

module.exports = router;
