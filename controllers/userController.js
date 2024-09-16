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
      if (await bcrypt.compare(password, user.password)) {
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

async function deleteUser(req, res) {
  const id = req.params.id;
  try {
    if (!id) {
      return res.status(400).json({ message: "ID inválido!" });
    }
    await userModel.deleteById(id);
    return res.status(200).json({ message: "Usuário deletado com sucesso!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Erro ao deletar o usuário! Tente novamente mais tarde!",
    });
  }
}

module.exports = {
  create,
  login,
  deleteUser,
};
