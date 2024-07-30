const express = require("express");
const { cadSkill, seedEventPhrases } = require("./models/admin.js");

seedEventPhrases();

const { getByName } = require("./models/regionModel");

const app = express();

app.use(express.json());

app.use("/public", express.static(__dirname + "/public"));

// Importando Rotas:
const index = require("./router/indexRoutes.js");
app.use("/", index);

const user = require("./router/userRoutes.js");
app.use("/user", user);

const player = require("./router/playerRoutes.js");
app.use("/player", player);

app.listen(3000, () => {
  console.log("server started");
});
