const express = require("express");
const { cadSkill, seedEventPhrases } = require("./models/admin.js");
const { getByName } = require("./models/regionModel.js");

async function a() {
  console.log(await getByName("Floresta do Esquecimento"));
}

a();
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

const region = require("./router/regionRoutes.js");
app.use("/region", region);

const enemy = require("./router/enemyRoutes.js");
app.use("/enemy", enemy);

app.listen(3000, () => {
  console.log("server started");
});
