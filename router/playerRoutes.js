const express = require("express");
const router = express.Router();

const { get } = require("../controllers/playerController");

// Obter um jogador
router.get("/", get);
// Salvar o jogador e os dados de game
// router.get("/save", save);

module.exports = router;
