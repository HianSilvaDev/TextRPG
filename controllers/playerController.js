const Player = require("../models/PlayerModel");

const create = (req, res) => {
  const {classe, name} = req.body;
  const id = req.session.user.id;
  const newPlayer = new Player(id, name, classe);
  try{
    newPlayer.save();
    res.status(201).json({ message: "Pesornagens criado com sucesso!" });
  }catch(err){
    console.log(err)
    res.status(500).json({ error: "Erro ao criar personagens!" });
  }
}

const get = async (req, res) => {
  const id = req.session.user.id;
  try{
    const player = await Player.getById(id);
    if(player){
      res.status(200).json(player);
    }else{
      res.status(404).json({ error: "Personagem não encontrado!" });
    }
  }catch(err){
    console.log(err)
    res.status(500).json({ error: "Erro ao buscar o Personagem!" });
  }
}

const update = (req, res) => {
  const player = req.body
  try{
    Player.update(player);
    res.status(200).json({ message: "Personagem atualizado com sucesso!" })
  }catch(err){
    console.log(err)
    res.status(500).json({ error: "Erro ao atualizar o Personagem!" })
  }
}

module.exports = {
  create,
  update,
  get
}