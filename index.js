const express = require("express");
// const { getByName } = require("./models/regionModel.js");

const app = express();

// async function a() {
//   console.log(await getByName("Floresta do Esquecimento"));
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

app.listen(8080, () => {
  console.log("server started");
});
