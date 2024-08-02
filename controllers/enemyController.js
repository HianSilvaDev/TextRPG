const { get } = require("http");
const { getByRegionName } = require("../models/enemyModel");

const getEnemies = async (req, res) => {
  try {
    const { name } = req.query;
    const enemies = await getByRegionName(name);
    if (enemies) {
      res.satus(200).json(enemies);
    } else {
      res.status(404).json({ error: "Erro ao buscar inimigos" });
    }
  } catch (err) {
    console.log(err);
    res.status(501).json({ error: "Erro no Servidor" });
  }
};

module.exports = {
  getEnemies,
};
