const {
	getbyId,
	update,
	skillsActions,
	itensActions,
	updateSave,
} = require("../models/playerModel");

const get = async (req, res) => {
	let { id } = req.query;
	id = parseInt(id);
	try {
		const player = await getbyId(id);
		if (player) {
			res.status(200).json(player);
		} else {
			res.status(404).json({ error: "Personagem não encontrado!" });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Erro ao buscar o Personagem!" });
	}
};

const save = async (req, res) => {
	const save = req.save;
	if (!save) return res.status(400).json({ error: "Corpo da requisição vazio ou inválido!" });
	try {
		await update(save.player);
		await skillsActions(save.skillLog);
		await itensActions(save.itensLog);
		await updateSave(save);
		return res.status(200).json({ message: "Dados salvos com sucesso!" });
	} catch (error) {
		res.status(500).json({ error: "Erro ao salvar os dados! Tente novamente mais tarde." });
	}
};

module.exports = {
	get,
	save,
};
