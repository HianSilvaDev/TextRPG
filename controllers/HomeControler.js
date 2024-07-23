const path = require('path');

const home = (req, res) => {
  return res.sendFile(path.resolve(path.join(__dirname, '../public/pages/home.html')));
}

const index = (req, res) => {
  return res.sendFile(path.resolve(path.join(__dirname, '../public/pages/index.html')))
}

const world = (req, res) => {
  res.sendFile(path.resolve(path.join(__dirname, '../public/pages/world.html')))
}

const admin = (req, res) => {
  return res.sendFile(path.resolve(path.join(__dirname, '../public/pages/admin.html')))
}

module.exports = {home, index, world, admin}
