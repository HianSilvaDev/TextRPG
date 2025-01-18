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

regenHP() {}
	regenMP() {}