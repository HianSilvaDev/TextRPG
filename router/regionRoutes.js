const express = require("express");
const router = express.Router();
const { get } = require("../controllers/regionController");

router.get("/", get);
module.exports = router;
