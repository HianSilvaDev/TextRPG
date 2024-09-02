const express = require("express");
// const { cadSkill } = require("./models/admin.js");
const app = express();

// async function a() {
//   console.log(await cadSkill());
// }
// a();
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

app.listen(3000, () => {
  console.log("server started");
});
