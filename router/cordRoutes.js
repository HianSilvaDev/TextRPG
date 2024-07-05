const express = require('express');
const router = express.Router();

const {get, getByCordinates} = require('../controllers/cordController')

router.get("/", get)

router.post("/getByCordinates", getByCordinates)


module.exports = router;