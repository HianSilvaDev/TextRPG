const Region = require('../models/regionModel');


const get = async (req, res) => {
  try {
    const regions = await Region.getAll();
    res.json(regions);
  } catch (err) {
    res.status(500).json({ error: err });
  }
}

const getByName = async (req, res) => {
  const {name} = req.body;
  try{
    const region = await Region.getByName(name);
    res.json(region);
  }catch(err){
    res.status(500).json({ error: err});
  }
}

module.exports = {
  get,
  getByName
}