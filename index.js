const express = require("express");

<<<<<<< HEAD
// cadSkill();
=======
>>>>>>> 7ad51efae8e9cc8cbba5e719f494cc2da5e61b88
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

app.listen(8080, () => {
  console.log("server started");
});
