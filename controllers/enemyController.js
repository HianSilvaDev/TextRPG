const Enemy = require("../models/enemyModel");

const create = async (req, res) => {
  const {region, name, atb} = req.body;
  const newEnemy = new Enemy(region, name, atb);
  try{
    await newEnemy.save();
    res.status(201).json({ message: "Inimigo criado com sucesso!" });
  }catch(err){
    res.status(500).json({ error: "Erro ao criar inimigo!" });
  }
}

const get = async (req, res) => {
  const region = req.body;
  try{
    enemys = await Enemy.getByRegion(region);
    if(enemys){
      res.status(200).json(enemys);
    }else{
      res.status(404).json({ error: "Inimigo não encontrado!" });
    }
  }catch(err){
    res.status(500).json({ error: "Erro ao buscar o inimigo!" });
  }
}

module.exports = {
  create,
  get
}
