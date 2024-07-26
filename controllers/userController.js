const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

const create = async (req, res) => {
  const { name, password, email, classe } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.createUser(name, email, hashedPassword, classe);
    return res.status(201).json({ message: "Usuario criado com sucesso!" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await userModel.getUserByEmail(name);
    if (user) {
      if (bcrypt.compare(password, user.password)) {
        res.status(200).json({
          name: user.name,
          id: user.id,
        });
      } else {
        throw new Error("Usuário ou senha inválidos!");
      }
    } else {
      throw new Error("Usuário ou senha inválidos!");
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  create,
  login
}
