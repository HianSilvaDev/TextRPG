const express = require("express");
// const { cadSkill } = require("./models/admin.js");

// cadSkill();

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

const enemy = require("./router/enemyRoutes.js");
app.use("/enemy", enemy);

app.listen(3000, () => {
  console.log("server started");
});
