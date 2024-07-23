const PlayerModel = require("../models/playerModel");

const get = async (req, res) => {
  const { id } = req.body;
  console.log(id);
  try {
    const player = await PlayerModel.getById(id);
    if (player) {
      res.status(200).json(player);
    } else {
      res.status(404).json({ error: "Personagem não encontrado!" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro ao buscar o Personagem!" });
  }
};

const update = async (req, res) => {
  const player = req.body;
  try {
    await PlayerModel.update(player);
    res.status(200).json({ message: "Personagem atualizado com sucesso!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro ao atualizar o Personagem!" });
  }
};

module.exports = {
  update,
  get,
};
