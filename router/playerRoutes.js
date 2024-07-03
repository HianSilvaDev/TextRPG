const express = require('express');
const router = express.Router(); 

const {create, update, get} = require('../controllers/playerController');

// Criar um novo jogador
router.post('/new', create);

// Atualizar um jogador
router.post('/update', update);

// Obter um jogador
router.get('/get', get);

module.exports = router;