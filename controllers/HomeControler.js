const path = require("path");

const home = (req, res) => {
	return res.sendFile(path.resolve(path.join(__dirname, "../views/home.html")));
};

const index = (req, res) => {
	return res.sendFile(path.resolve(path.join(__dirname, "../views/index.html")));
};

const world = (req, res) => {
	res.sendFile(path.resolve(path.join(__dirname, "../views/world.html")));
};

const admin = (req, res) => {
	return res.sendFile(path.resolve(path.join(__dirname, "../views/admin.html")));
};

module.exports = { home, index, world, admin };
