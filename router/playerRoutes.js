const express = require('express');
const router = express.Router(); 

const {get} = require('../controllers/playerController');

// Obter um jogador
router.get('/', get);

module.exports = router;
