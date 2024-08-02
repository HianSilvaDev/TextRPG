const { getEnemies } = require("../controllers/enemyController");

const express = require("express");
const router = express.Router();

router.get("/", getEnemies);

module.exports = router;
