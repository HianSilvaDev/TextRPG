const express = require("express");
const router = express.Router();
const get = require("./controller/regionController");

router.get("/", getByName);
module.exports = router;
