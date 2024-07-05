const Terrain = require('../models/cordModel');

const get = async (req, res) => {
  try {
    const terrains = await Terrain.getAll();
    res.json(terrains);
  } catch (err) {
    res.status(500).json({ error: err });
  }
}

const getByCordinates = async (req, res) => {
  const {x, y} = req.body;
  try{
    const terrain = await Terrain.getByCordinates(x, y);
  }catch(err){
    res.status(500).json({ error: err});
  }
}

module.exports = {
  get,
  getByCordinates
}