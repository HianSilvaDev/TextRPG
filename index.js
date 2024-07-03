const express = require('express');
const session = require('express-session')

const app = express();

app.use(express.json());

app.use(session({
  secret: 'keyboardcat',
  resave: false,
  saveUninitialized: true
}))

app.use("/public", express.static(__dirname + "/public"));
// Importando Rotas:
const index = require("./router/indexRoutes.js");

const user = require("./router/userRoutes.js");

const player = require("./router/playerRoutes.js");

const enemy = require("./router/enemyRoutes.js");

app.use('/', index)

app.use('/user', user)

app.use('/player', player)

app.use('/enemy', enemy)

app.listen(3000, () => {
  console.log('server started');
})