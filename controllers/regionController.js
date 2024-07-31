const {getByName} = require("./models/regionModel")

const get = async (req, res) => {
  const {name} = req.body;
  const region = await getByName(name);

  if(region){
    res.status(200).json(region);
  }else{
    res.status(404).json({error: "Erro ao buscar dados"});
  }
}

module.exports = {
  get
}
