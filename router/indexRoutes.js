"use strict";

const express = require("express");
const router = express.Router();
const path = require("path");
const { home, index, world, admin} = require("../controllers/HomeControler");

router.get("/", index);

router.get("/home", home);

router.get("/world", world);

router.get("/admin", admin);

module.exports = router;