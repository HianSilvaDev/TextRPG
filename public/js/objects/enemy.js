export class Enemy {
	constructor(enemy, playerLvl) {
		this.enemy = enemy;
		JSON.parse(sessionStorage.setItem("opponent", enemy));
		balanceMobStatus(playerLvl);
	}

	#getSkill() {
		const skillsThatAreNotOnCooldown = this.enemy.filter((skill) => !skill.isCooldown);

		if (!checkObjectAttribute(skillsThatAreNotOnCooldown)) return;

		const skill = randomize(skillsThatAreNotOnCooldown);

		return skill;
	}

	setSkillDamage() {
		const skill = this.#getSkill();

		if (
			!this.#checkObjectAttribute(skill) ||
			!this.#checkObjectAttribute(JSON.parse(skill.data).damage)
		)
			return;

		const damage = JSON.parse(skill.data).damage + this.enemy.strength;

		return parseInt(damage);
	}

	setEffect() {
		const skill = this.#getSkill();

		if (
			!this.#checkObjectAttribute(skill) ||
			!this.#checkObjectAttribute(JSON.parse(skill.data)) ||
			!this.#checkObjectAttribute(JSON.parse(skill.effect))
		)
			return;
	}

	#balanceMobStatus(lvlBalance) {
		if (this.enemy >= lvlBalance) return;

		const levelDiference = lvlBalance - this.enemy.level;
		const percentHp = (this.enemy.spawnrate * this.enemy.hp) / 100;
		const percentMp = (this.enemy.spawnrate * this.enemy.mp) / 100;
		const percentStrength = (this.enemy.spawnrate * this.enemy.strength) / 100;
		const percentDefense = (this.enemy.spawnrate * this.enemy.defense) / 100;

		this.enemy.hp = levelDiference * percentHp;
		this.enemy.mp = levelDiference * percentMp;
		this.enemy.strength = levelDiference * percentStrength;
		this.enemy.defense = levelDiference * percentDefense;
	}

	#checkObjectAttribute(param) {
		if (!param || param == null || skillsThatAreNotOnCooldown.length < 0) {
			return false;
		}
		return true;
	}

	#mpRegen() {}
}
