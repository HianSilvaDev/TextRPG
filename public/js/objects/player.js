export class Player {
	constructor(id) {
		this.dataPlayer;

		this.#getDataPlayer(id);
	}

	async #getDataPlayer(id) {
		if (this.#haveDataPlayerInStorage()) return;
		await fetch(`/player?id=${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				if (!res.ok) throw new Error(`HTTP error! MESSAGE: ${res.status}`);
				return res.json();
			})
			.then((data) => {
				this.dataPlayer = data;
				sessionStorage.setItem("player", JSON.stringify(data));
			})
			.catch((err) => {
				throw new Error(err);
			});
	}

	getData() {
		return new Promise((resolve) => {
			// Simulando um tempo de resposta variável (entre 1 e 5 segundos)
			const randomTime = Math.floor(Math.random() * 5000) + 1000; // entre 1 e 5 segundos
			setTimeout(() => {
				const data = {
					name: this.dataPlayer.name,
					class: this.dataPlayer.class,
					level: this.dataPlayer.level,
					wallet: this.dataPlayer.wallet,
				};
				resolve(data);
			}, randomTime);
		});
	}

	getStatus() {
		return {
			hp: this.dataPlayer.hp,
			mp: this.dataPlayer.mp,
			força: this.dataPlayer.strength,
			defesa: this.dataPlayer.defense,
			destreza: this.dataPlayer.dexterity,
			resistencia: this.dataPlayer.resistance,
			inteligencia: this.dataPlayer.intelligence,
			sorte: this.dataPlayer.luck,
		};
	}

	getAllSkills() {
		if (!this.#checkObjectAttribute(this.dataPlayer.skills)) {
			throw new Error("O player não possui skills?");
		}
		return this.dataPlayer.skills;
	}

	getSkillEquiped() {
		return this.dataPlayer.skills.filter((skill) => skill.isEquiped);
	}

	setSkillToUse(id) {
		const skillsEquiped = this.getSkillEquiped();
		const skill = skillsEquiped.find((skill) => skill.id_skill == id);
		return skill;
	}

	skillDamageExist(skill) {
		if (!this.#checkObjectAttribute(JSON.parse(skill.data).damage)) return;

		const damage = this.#setSkillDamage(JSON.parse(skill.data).damage);
		return damage;
	}

	#setSkillDamage(skillDamage) {
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

	getGold() {}

	getInventory() {
		return this.dataPlayer.inventory;
	}

	setNewItem(item) {
		this.dataPlayer.inventory.push(item);
		let player = JSON.parse(sessionStorage.getItem("player"));
		player.inventory.push(item);
		sessionStorage.setItem("player", JSON.stringify(player));
	}

	#checkObjectAttribute(param) {
		if (!param || param == null) {
			return false;
		}
		return true;
	}

	#haveDataPlayerInStorage() {
		if (sessionStorage.getItem("player")) {
			this.dataPlayer = JSON.parse(sessionStorage.getItem("player"));
		}
	}
}
