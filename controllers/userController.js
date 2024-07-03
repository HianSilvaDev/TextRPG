"use strict";
const User = require("../models/userModel");

const sessao = (req, res) => {
  if(req.session.user){
    return res.json(req.session.user)
  }else{
    res.redirect("/login")
  }
}

const create = async (req, res) => {
  const { name, password, email} = req.body;
  
  const userEmail =  await User.getByEmail(email);
  const userName = await User.getByName(name);
  try{
    const newUser = new User(name, password, email);
    if(userEmail || userName){
      res.status(400).json({ error: "Usuário e Email em uso!" })
    }else{
      newUser.save();
      req.session.user = newUser;
      res.status(201).json({ message: "Usuário criado com sucesso!" });
    }
  }catch(err){
    console.log(err)
    res.status(500).json({redirect:  "/home"});
  }
};

const login = async (req, res) => {
  console.log(req.body)
  const {emailOrName, password} = req.body;
  try{
    let user;
    user = await User.getByEmail(emailOrName);
    if(!user){
      user = await User.getByName(emailOrName);
    }
    if(user){
      if(user.password === password){
        req.session.user = user;
        res.status(200).json({ message: "Login realizado com sucesso!" });
      }else{
        res.status(401).json({ error: "Senha incorreta!" });
      }
    }
  }catch(err){
    res.status(500).json({ error: "Erro ao realizar login!" });
  }
};

const logout = (req, res) => {
  if(req.session.user){
    req.session.destroy();
  }
  return res.json({ redirect: "/" });
}

module.exports = {
  sessao,
  create,
  login,
  logout
};
