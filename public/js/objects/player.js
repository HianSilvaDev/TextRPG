export class Player {
	constructor(id) {
		this.dataPlayer;

		this.#thereIsPlayerData();

		return this.dataPlayer;
	}

	#getDataPlayer(id) {
		fetch(`/player?id=${parseInt(id)}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				this.dataPlayer = data;

				sessionStorage.setItem("player", JSON.stringify(data));
			})

			.catch((err) => {
				throw new Error(err.message);
			});
	}

	getAllSkills() {
		if (!this.#checkObjectAttribute(this.dataPlayer.skills)) {
			throw new Error("O player não possui skills?");
		}

		return this.dataPlayer.skills;
	}

	getSkillEquiped() {
		return this.dataPlayer.skills.filter((skill) => skill.equiped);
	}

	skillDamageExist(skill) {
		let exist = true;
		if (!this.#checkObjectAttribute(JSON.parse(skill.data).damage)) {
			exist = false;
		}

		return exist;
	}

	setSkillDamage(skillDamage) {
		const damage = this.dataPlayer.strength + skillDamage;

		if (damage < 0) return 0;

		return damage;
	}

	skillEffectExist(skill) {
		let exist = true;
		if (!this.#checkObjectAttribute(skill.effect)) {
			exist = false;
		}

		return exist;
	}

	getSkillEffect(skill) {
		switch (skill.type) {
			case "ATAQUE_FISICO" || "MAGIC_ATACK":
				break;

			case "BUFF":
				break;

			case "DEBUFF":
				break;

			case "ESCAPE":
				break;

			case "SHIELD":
				break;

			case "REGEN_MP":
				break;

			default:
				console.log("Skill Type not found");
				break;
		}
	}

	#debuffing(skill) {
		switch (JSON.parse(skill.data).debufftype) {
			case defense:
				break;

			default:
				break;
		}
	}

	async #buffing(skill) {
		let timeBuffing;
		switch (JSON.parse(skill.data).buffTargets) {
			case defense:
				this.dataPlayer.defense += JSON.parse(skill.data).value;

				timeBuffing = JSON.parse(skill.data).duration * 1000;
				await new Promise(
					setTimeout(() => {
						this.dataPlayer.defense -= JSON.parse(skill.data).value;
					}, timeBuffing)
				);
				break;

			default:
				break;
		}
	}

	async #shielding(skill) {
		switch (JSON.parse(skill.data).valueType) {
			case "percent":
				this.dataPlayer.shielding = JSON.parse(skill.data).amount;
				const timeShielding = JSON.parse(skill.data).duration * 1000;
				await new Promise(
					setTimeout(() => {
						delete this.dataPlayer.shielding;
					}, timeShielding)
				);
				break;

			default:
				break;
		}
	}

	#mpRegeneration(skill) {
		this.dataPlayer.mp += JSON.parse(skill.data).amount;
	}

	#hpRegeneration(skill) {
		this.dataPlayer.hp += JSON.parse(skill.data).amount;
	}

	#escaping(skill) {
		const escapeChance =
			this.dataPlayer.dexterity * 2 +
			this.dataPlayer.luck * 1.5 -
			JSON.parse(skill.data).accuracy * 0.5;
		if (escapeChance < 0) {
			return;
		}
		user.escape = true;
	}

	getGold() {}

	getInventoey() {}

	setNewItem(item) {
		dataPlayer.inventory += item;
	}

	#checkObjectAttribute(param) {
		if (!param || param == null) {
			return false;
		}
		return true;
	}

	#thereIsPlayerData() {
		if (sessionStorage.getItem("player") && !this.#checkObjectAttribute(this.dataPlayer))
			this.dataPlayer = JSON.parse(sessionStorage.getItem("player"));

		if (!sessionStorage.getItem("player")) this.dataPlayer = this.#getDataPlayer(id);
	}

	regenHP() {}
	regenMP() {}
}
