const { getbyId } = require("../models/playerModel");

const get = async (req, res) => {
  let { id } = req.query;
  id = parseInt(id);
  try {
    const player = await getbyId(id);
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

module.exports = {
  get,
};
