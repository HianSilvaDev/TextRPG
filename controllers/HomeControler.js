const path = require('path');

const home = (req, res) => {
  if(!req.session.user){
    return res.redirect('/')
  }
  return res.sendFile(path.resolve(path.join(__dirname, '../public/pages/home.html')));
}

const index = (req, res) => {
  if(req.session.user){
    return res.redirect('/home')
  }
  return res.sendFile(path.resolve(path.join(__dirname, '../public/pages/index.html')))
}

const world = (req, res) => {
  if(req.session.user){
res.sendFile(path.resolve(path.join(__dirname, '../public/pages/world.html')))
  }else{
    res.redirect('/')
  }
}

const admin = (req, res) => {
  return res.sendFile(path.resolve(path.join(__dirname, '../public/pages/admin.html')))
}

module.exports = {home, index, world, admin}