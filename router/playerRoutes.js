const express = require('express');
const router = express.Router(); 

const {update, get} = require('../controllers/playerController');

// Atualizar um jogador
router.post('/update', update);

// Obter um jogador
router.get('/get', get);

module.exports = router;
