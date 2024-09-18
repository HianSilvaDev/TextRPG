if (!sessionStorage.getItem("data")) window.location = "/";

window.onload = getDataPlayer();
const btnDirections = document.querySelectorAll(".btnDirections");

btnDirections.forEach((btn) => {
	btn.addEventListener("click", () => {
		let vector2 = JSON.parse(btn.value);
		newCordinates(vector2.x, vector2.y);
	});
});

const verifyMp = setInterval(() => regenMp(), 3000);
const verifyHp = setInterval(() => regenHp(), 3000);

const openMenu = document.getElementById("openMenu");

const containerContent = document.querySelector(".content");

let cordinatesX = 1;
let cordinatesY = 1;
let dataCurrentRegion;
let dataPlayer;
let opponentData;
let isBatle = false;
let itemData;

const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true }); //retorna um objeto com metodos para desenhar no canvas
const img = new Image();
img.src = "./public/assets/2DMap.png";

//Quando a imagem for carregada, ajusta o tamanho do canvas ao tamanho da imagem e a desenha
img.onload = function () {
	canvas.width = img.width;
	canvas.height = img.height;
	ctx.drawImage(img, 0, 0);
};

// Lembrar de modificar os valores subsequente a clareira mais tarde
const colorToLocality = {
	"rgb(0, 100, 0)": "Floresta do Esquecimento",
	"rgb(85, 153, 68)": "Clareira",
	"rgb(182, 45, 45)": "Cidade",
	"rgb(204, 255, 51)": "Vilarejo",
	"rgb(255, 255, 255)": "Topo da Montanha",
	"rgb(153, 170, 119)": "Pé da Montanha",
	"rgb(51, 102, 153)": "Lago ou rio",
};

/**
 *
 * @param {Number} x
 * @param {Number} y
 * @returns Number|String
 */
function getLocalityNameByColor(x, y) {
	//Recebe a posição x e y do pixel e atribui a variavel color a cor do mesmo em formato rgb
	const imageData = ctx.getImageData(x, y, 1, 1).data;
	let color = `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;
	// Retorna o valor do objeto colorToLocality que possui a key igual a color
	return colorToLocality[color];
}

/**
 * atribui um valor minimo e maximo, e se o valor infringir-los retorna o valor corrigido ao valor mais proximo dentro do intervalo definido.
 *
 * @param {Number} value
 * @param {Number} min
 * @param {Number} max
 * @returns Number
 */
function limitValue(value, min, max) {
	return Math.min(Math.max(value, min), max);
}

/**
 *
 * @param {Number} x
 * @param {Number} y
 * @returns
 */
function getPixelColor(x, y) {
	const imageData = ctx.getImageData(x, y, 1, 1).data;
	return `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;
}

/**
 * Define as cordenadas do player
 *
 * @param {Number} newx
 * @param {Number} newy
 */
function newCordinates(newx, newy) {
	// Soma as cordenadas atuais do player com a adição do movimento
	let x = cordinatesX + newx;
	let y = cordinatesY + newy;

	// Confere se a nova posição esta dentro do permitido, sendo esse os limites do mapa.
	if (x < 1 || x >= canvas.width || y < 0 || y >= canvas.height) {
		// Se fora dos limites, Escreve "fora dos limites" para player e não muda a posição do player
		printNarration("Fora dos limites!");
		return;
	}

	// Estando dentro dos limites, se necessario corrige as novas cordenadas aos limites do mapa e as atribui ao player
	cordinatesX = limitValue(x, 1, canvas.width - 1);
	cordinatesY = limitValue(y, 1, canvas.height - 1);

	// Recebe o nome da região com base nas novas cordenadas
	let region = getLocalityNameByColor(cordinatesX, cordinatesY);

	// Verifica se é igual a atual. Se assim for, chama a função printNarration, caso contrario busca a nova região no banco de dados
	if (!dataCurrentRegion || region != dataCurrentRegion.name) {
		if (!region) {
			insertCardContent(`
				<div class="cardText">
				  <span class = "title">Região Bloqueada</span>
				  <p class="description">
					Essa região ainda não está disponivel para esploração
				  </p>
				</div>
				`);
			return;
		}

		getDataRegion(region);
		return;
	}

	checkTypeOfNarrationToBePrinted(dataCurrentRegion);
}

/**
 * Verificar se o player irá se encontrar com algo ou não e determinar qual narração irá aparecer
 *
 * @param {Object} data
 */
function checkTypeOfNarrationToBePrinted(data) {
	let messages = "";
	let spawn;
	const d40 = Math.floor(Math.random() * 40);

	messages = data.EventPhrase.filter((events) => events.eventType === "no_item_found") ?? "";

	if (d40 <= 10) {
		spawn = raffleMobOurItens(data.enemies);
		opponentData = spawn;
		createTheSpawnCard(spawn, ["lutar", "fugir"]);
		messages = data.EventPhrase.filter((events) => events.eventType === "encounter_enemy") ?? "";
	}

	if (d40 > 10 && d40 <= 20) {
		spawn = raffleMobOurItens(data.findableItems);
		createTheSpawnCard(spawn, ["pegar", "ignorar"]);
		itemData = spawn;
		messages = data.EventPhrase.filter((events) => events.eventType === "find_item") ?? "";
	}

	const message = randomize(messages).text;
	printNarration(message, spawn);
}

/**
 * Cria o card referente ao spawn
 *
 * @param {Array} spawn
 * @param {Array} options
 */
function createTheSpawnCard(spawn, options) {
	directionsBlock(true);
	let card = `
    <div class="cardText">
      <span class="title">${spawn.name}</span>
      <p class="description">${spawn.desc}</p>
    </div>
    <div class="cardBtnGroup">
  `;

	options.forEach((option) => {
		card += `<button onclick="actionForBtn('${option}')">${option}</button>`;
	});

	card += "</div>";

	insertCardContent(card);
}

/**
 * Ativa uma função diferente de acordo com a decisão do player
 *
 * @param {String} action
 */
function actionForBtn(action) {
	switch (action) {
		case "fugir":
			// if (dataPlayer.dexterity * 2 + dataPlayer.luck * 1.5 < opponentData.dexterity * 2 + opponentData.luck * 1.5) {
			// 	printNarration("Você não conseguiu fugir!");
			// 	setTimeout(() => {
			// 		openArena();
			// 	}, 1500);
			// }
			escapeAction();
			break;

		case "lutar":
			printNarration("Entrando em combate!");
			setTimeout(() => {
				openArena();
			}, 1500);
			break;

		case "pegar":
			dataPlayer.inventory.push(itemData);
			let player = JSON.parse(sessionStorage.getItem("player"));
			player.inventory.push(itemData);
			sessionStorage.setItem("player", JSON.stringify(player));
			escapeAction();
			break;

		case "ignorar":
			escapeAction();
			break;

		default:
			console.log("algo deu errado!!");
			break;
	}
}

// Ignorar aparição de algo
function escapeAction() {
	directionsBlock(false);
	insertCardContent("");
	opponentData = "";
}

// Cria o campo de batalha
function openArena() {
	isBatle = true;
	const painelBatle = document.querySelector(".painelBatle");
	const painelDefault = document.querySelector(".painel");
	const btnActions = document.querySelector(".actions");

	updateBattleLog("Inicio da batalha!");

	painelBatle.classList.remove("hiddenComponet");
	painelDefault.classList.add("hiddenComponet");

	dataPlayer.skills.forEach((skill) => {
		if (skill.isEquiped) {
			btnActions.innerHTML += `<button onClick="skillToUse(${skill.id_skill},event)">${skill.name}</button>`;
		}
	});

	if (dataPlayer.hp <= 0) {
		exitArena(`Você foi derratado por ${opponentData.name}`);
		return;
	}

	sessionStorage.setItem("opponent", JSON.stringify(opponentData));

	updateBattleStatus(dataPlayer, opponentData);
	setTimeout(() => {
		mobAtack(opponentData);
	}, 1000);
}

function exitArena(message) {
	const painelBatle = document.querySelector(".painelBatle");
	const painelDefault = document.querySelector(".painel");
	const btnActions = document.querySelector(".actions");

	painelDefault.classList.remove("hiddenComponet");
	painelBatle.classList.add("hiddenComponet");
	btnActions.innerHTML = "";

	printNarration(message);

	escapeAction();
	isBatle = false;
}

// pega os dados da skill que irá ser usada
function skillToUse(skillId, e) {
	let damage = 0;
	const index = dataPlayer.skills.findIndex((p) => p.id_skill == skillId);
	const skill = dataPlayer.skills[index];

	if (checkObjectAttribute(dataPlayer.stun)) {
		updateBattleLog(`${dataPlayer.name} está estunado`);
		return;
	}

	if (checkObjectAttribute(skill.isCooldown)) {
		updateBattleLog(`${skill.name} está em tempo de recarga!`);
		return;
	}

	if (dataPlayer.mp < skill.cost) {
		updateBattleLog("Você não tem mp o sufiente");
		return;
	}

	e.target.style = "background: var(--btn-bg-2);";

	dataPlayer.mp -= skill.cost;

	if (checkObjectAttribute(JSON.parse(skill.data))) {
		if (checkObjectAttribute(JSON.parse(skill.data).damage)) {
			damage = calculateDamage(dataPlayer, JSON.parse(skill.data), opponentData);
			opponentData.hp -= damage;
			updateBattleLog(`Você causou ${damage} de dano`);
		}

		checkSkillTypeAndAplly("player", skill);
	}

	skill.isCooldown = true;

	setTimeout(() => {
		skill.isCooldown = false;
		e.target.style = "background: #1d282c;";
	}, skill.cooldown * 1000);

	if (opponentData.hp <= 0) {
		console.log("Inimigo derrotado!");
		setTimeout(() => {
			exitArena();
		}, 1500);
	}
}

/**
 * gerencia os ataques dos mobs
 *
 * @param {object} mob
 */
function mobAtack(mob) {
	const mobIntervalAtacking = setInterval(async () => {
		if (checkObjectAttribute(opponentData.escape)) {
			clearInterval(mobIntervalAtacking);
			return;
		}

		if (opponentData.hp <= 0) {
			clearInterval(mobIntervalAtacking);
			exitArena(`Você derrrotOU um ${opponentData.name}`);
			return;
		}
		if (dataPlayer.hp <= 0) {
			dataPlayer.hp = 0;
			clearInterval(mobIntervalAtacking);
			exitArena(`Você foi derrotado por um ${opponentData.name}`);
			return;
		}

		const opponent = JSON.parse(sessionStorage.getItem("opponent"));

		if (opponentData.mp < opponent.mp) {
			opponentData.mp += 1.5;
		}

		if (checkObjectAttribute(opponentData.stun)) {
			updateBattleLog(`${mob.name} está estunado`);
			return;
		}

		// Randomiza a habilidade que o mob irá ultilizar para atacar
		let damage = 0;
		const skillsThatAreNotOnCooldown = mob.skills.filter((skill) => !skill.isCooldown);

		if (skillsThatAreNotOnCooldown.length > 0) {
			const skill = randomize(skillsThatAreNotOnCooldown);

			if (opponentData.mp < skill.cost) {
				console.log(`O mp atual de ${mob.name} é ${mob.mp}`);
				return;
			}

			opponentData.mp -= skill.cost;

			if (checkObjectAttribute(skill.data)) {
				if (checkObjectAttribute(JSON.parse(skill.data).damage)) {
					damage = calculateDamage(mob, JSON.parse(skill.data), dataPlayer);
					dataPlayer.hp -= damage;
					updateBattleLog(`Você sofreu ${damage} de dano`);
				}
				checkSkillTypeAndAplly("enemy", skill);
			}

			const index = mob.skills.findIndex((m) => m.id_skill == skill.id_skill);
			mob.skills[index].isCooldown = true;
			const time = mob.skills[index].cooldown * 1000;

			await new Promise((resolve) =>
				setTimeout(() => {
					mob.skills[index].isCooldown = false;
					resolve();
				}, time)
			);
		} else {
			console.log("Todas as habilidades estão em cooldown. Aguardando...");
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	}, 1000);
}

/**
 * Função verifica quanto de dano será mitigado, após o calculo aplica o dano ao destinatário
 *
 * @param {Object} user
 * @param {Object} skillData
 * @param {Object} addressee
 */
function calculateDamage(user, skillData, addressee) {
	let damage =
		user.strength + skillData.damage >= 0 && typeof (user.strength + skillData.damage) === "number"
			? user.strength + skillData.damage
			: 0;

	if (checkObjectAttribute(addressee.shielding)) {
		// console.log(user.shielding);

		damage = shieldAplly(damage, addressee.shielding);
	}
	console.log(`
    damage: ${damage - addressee.defense > 0 ? damage - addressee.defense : 0}
    addressee: ${addressee.name}
  `);

	return damage - addressee.defense > 0 ? damage - addressee.defense : 0;
}

function checkObjectAttribute(param) {
	if (!param || param == null) {
		return false;
	}
	return true;
}

/**
 *
 * @param {String} user
 * @param {Object} skill
 * @param {String} addressee
 * @returns
 */
function checkSkillTypeAndAplly(user, skill, addressee = "") {
	if (user == "player") {
		user = dataPlayer;
		addressee = opponentData;
	} else {
		user = opponentData;
		addressee = dataPlayer;
	}

	console.log(skill.type);

	const skillData = JSON.parse(skill.data);
	const effectSkill = JSON.parse(skill.effect);

	switch (skill.type) {
		case "ATAQUE_FISICO" || "MAGIC_ATACK":
			if (!checkObjectAttribute(effectSkill)) return;
			let effect;
			const chance = user.dexterity * 2 + user.luck * 1.5 - skillData.accuracy * 0.5;

			if (chance < addressee.dexterity * 2 + user.luck * 1.5) {
				return;
			}

			if (effectSkill.type == "BURN") {
				updateBattleLog(`${addressee.name} está queimando`);

				effect = setInterval(() => {
					addressee.hp -= effectSkill.damage;
				}, 1000);
			}

			if (effectSkill.type == "bleed") {
				updateBattleLog(`${addressee.name} está sangrando`);

				effect = setInterval(() => {
					addressee.hp -= effectSkill.damage;
				}, 1000);
			}

			if (effectSkill.type == "STUN") {
				updateBattleLog(""`${addressee.name} está estunado`);

				effect = setInterval(() => {
					addressee.stun = true;
				}, 1000);
			}

			if (checkObjectAttribute(effectSkill.duration)) {
				const effectDuration = effectSkill.duration * 1000;

				setTimeout(() => {
					clearInterval(effect);
				}, effectDuration);
			}
			break;

		case "BUFF":
			const timeBuffing = skillData.duration * 1000;
			if (JSON.parse(skill.data).buffTarget == "defense") {
				user.buff = {
					value: skillData.value,
				};
				user.defense = buffingTheDefense(user.defense, JSON.parse(skill.data));

				reset = () => {
					user.defense = JSON.parse(sessionStorage.getItem("player")).defense;
				};
			}
			if (JSON.parse(skill.data).buffTarget == "strength") {
				user.buff = {
					value: skillData.value,
				};
				user.strenght = buffingThestrength(user.strenght, JSON.parse(skill.data));

				reset = () => {
					user.strenght = JSON.parse(sessionStorage.getItem("player")).strenght;
				};
			}

			setTimeout(() => {
				delete user.buff;
				reset();
			}, timeBuffing);
			break;

		case "DEBUFF":
			const timeDebuffing = skillData.duration * 1000;

			if (JSON.parse(skill.data).debuffType == "defense") {
				addressee.debuff = {
					value: skillData.debuffValue,
				};
				addressee.defense = debuffingTheDefense(addressee.defense, JSON.parse(skill.data));

				reset = () => {
					addressee.defense -= addressee.defense.value;
				};
			}
			if (JSON.parse(skill.data).debuffType == "strength") {
				addressee.debuff = {
					value: skillData.debuffValue,
				};
				addressee.strenght = debuffingThestrength(addressee.strenght, JSON.parse(skill.data));

				reset = () => {
					addressee.strenght -= addressee.debuff.value;
				};
			}

			setTimeout(() => {
				reset();
				delete user.debuff;
			}, timeDebuffing);
			break;

		case "ESCAPE":
			const escapeChance = user.dexterity * 2 + user.luck * 1.5 - skillData.accuracy * 0.5;
			if (escapeChance < addressee.dexterity * 2 + addressee.luck * 1.5) {
				updateBattleLog(`${user.name} tentou mas não conseguiu fugir`);
				return;
			}
			user.escape = true;
			exitArena(`${user.name} conseguiu fugir!`);
			break;

		case "SHIELD":
			const timeShielding = skillData.duration * 1000;
			user.shielding = {
				amount: skillData.amount,
				type: skillData.valueType,
			};

			console.log(user);

			if (skillData.valueType == "porcent") {
			} else {
				console.log("This type of value is invalid");
			}

			setTimeout(() => {
				delete user.shielding;
			}, timeShielding);
			break;

		default:
			return;
			break;
	}
}

function shieldAplly(damage, skillShield) {
	if (skillShield.type == "percent") {
		damage -= (skillShield.amount * damage) / 100;
	}
	if (skillShield.type == "quantity") {
		damage -= skillShield.amount;
	}

	return damage;
}

function buffingTheDefense(baseDefense, skillBuff) {
	if (skillBuff.type == "percent") {
		baseDefense += (skillBuff.amount * baseDefense) / 100;
	}
	if (skillBuff.type == "quantify") {
		baseDefense += skillBuff.amount;
	}

	return baseDefense;
}

function debuffingTheDefense(baseDefense, skillDebuff) {
	if (skillDebuff.type == "percent") {
		baseDefense -= (skillDebuff.amount * baseDefense) / 100;
	}
	if (skillDebuff.type == "quantify") {
		baseDefense -= skillDebuff.amount;
	}

	return baseDefense;
}

function buffingThestrength(baseStrength, skillBuff) {
	if (skillBuff.type == "percent") {
		baseStrength += (skillBuff.amount * baseStrength) / 100;
	}
	if (skillBuff.type == "quantify") {
		baseStrength += skillBuff.amount;
	}

	return baseStrength;
}

function debuffingThestrength(baseStrength, skillDebuff) {
	if (skillDebuff.type == "percent") {
		baseStrength -= (skillDebuff.amount * baseStrength) / 100;
	}
	if (skillDebuff.type == "quantify") {
		baseStrength -= skillDebuff.amount;
	}

	return baseStrength;
}

/**
 * Faz a troca do nome padrão para o do spawn
 *
 * @param {String} message
 * @param {String} spawnName
 * @returns String
 */
function printedReplace(message, spawnName) {
	if (message.includes("[nome do inimigo]")) {
		return message.replace("[nome do inimigo]", spawnName);
	}

	if (message.includes("[nome do item]")) {
		return message.replace("[nome do item]", spawnName);
	}

	console.log("Deu erro em algo");
}

/**
 *
 *
 * @param {Array|Object} itemsToRandomize
 *  *
 * @returns {object}
 */
function randomize(itemsToRandomize) {
	const indexItem = Math.floor(Math.random() * itemsToRandomize.length);
	let item = itemsToRandomize[indexItem];

	return item;
}

/**
 * Printar narração para o usúario
 *
 * @param {Array} messages
 * @param {Object} spawn
 */
function printNarration(message, spawn = "") {
	const txt = document.getElementById("narrations");

	if (spawn != "") {
		message = printedReplace(message, spawn.name);
	}

	txt.textContent = message;
}

/**
 * Sortear um mob com base na sorte do player e a raridade do mob
 *
 * @param {Array} array
 * @returns Object
 */
function raffleMobOurItens(array) {
	let spawn;
	const totalChance = array.reduce((total, mob) => total + mob.spawnrate, 0);
	const choice = Math.round(Math.random() * totalChance);
	let accumulated = 0;

	for (const obj of array) {
		accumulated += obj.spawnrate;
		if (choice <= accumulated) {
			return (spawn = obj);
		}
	}

	return spawn;
}

/**
 * Puxa os dados da região
 *
 * @param {string} region
 * @returns {Array}
 */
function getDataRegion(region) {
	fetch(`/region?name=${region}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((res) => res.json())
		.then((data) => {
			// console.log(data);
			dataCurrentRegion = data;

			insertCardContent(`
        <div class="cardText">
          <span class = "title">${data.name ?? "Região Bloqueada"}</span>
          <p class="description">
            ${data.desc ?? "Essa região ainda não está disponivel para esploração"}
          </p>
        </div>
        `);
			directionsBlock(false);
		})
		.catch((error) => {
			// console.log(error.message);
		});
}

/**
 *  Puxa os dados do player
 *
 * @param {String} id
 * @returns {Object}
 */
function getDataPlayer(id) {
	fetch(`/player?id=${parseInt(sessionStorage.getItem("data"))}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((res) => res.json())
		.then((data) => {
			dataPlayer = data;

			sessionStorage.getItem("player") ?? sessionStorage.setItem("player", JSON.stringify(data));
		})

		.catch((err) => {
			console.log(err.message);
		});
}

/**
 * Impede que o player se movemente
 *
 * @param {Boolean} isToBlock
 */
function directionsBlock(isToBlock) {
	btnDirections.forEach((btn) => {
		btn.disabled = isToBlock;
	});
}

/**
 * Injeta conteúdo no card
 *
 * @param {String} content
 */
function insertCardContent(content) {
	const card = document.querySelector(".card");

	card.innerHTML = "";
	card.innerHTML += content;
}

openMenu.addEventListener("click", () => {
	createMenu({
		title: "Menu",
		content: `
			<ul>
				<li><button onClick="createStatusMenu()"><img src="public\\assets\\img\\menuIcons\\status.png"></button></li>
				<li><button onClick="createInventoryMenu"><img src="public\\assets\\img\\menuIcons\\skills.png"></button></li>
				<li><button onClick="createSkillsMenu"><img src="public\\assets\\img\\menuIcons\\inventory.png"></button></li>
				<li><a href="/home"><button><img src="public\\assets\\img\\menuIcons\\home.png"></button></a></li>
				<li onClick="logout()"><button><img src="public\\assets\\img\\menuIcons\\logout.png"></button>li>
				<li><a href="#"><button><img src="public\\assets\\img\\menuIcons\\settings.png"></button></a></li>
			</ul>
		`,
		footer: `
			<p class="title" onClick="exitMenu()">Fechar</p>
		`,
	});
});

/**
 * Criar um menu para o usuário
 *
 * @param {Object} menuContent
 */
function createMenu(menuContent) {
	const menu = document.querySelector(".menu");
	const card = document.querySelector(".card");

	menu.classList.remove("hiddenComponet");
	card.classList.add("hiddenComponet");

	menu.innerHTML = `
	</span class="title">${menuContent.title}</span>

	<div class="menuContent">
		${menuContent.content}
	</div>

	<div class="menuFooter">
		${menuContent.footer}
	</div>
	`;
}

function createStatusMenu(data) {
	const menu = document.querySelector(".menu");

	menu.innerHTML = `
	</span class="title">Status</span>

	<div class="menuContent">
		<ul>
			<li>
				<span>${data.vitality}</span>
				<button onclick="addStatus(${data.vitality})"><img src="public\\assets\\img\\menuIcons\\add.png"></button>
			</li>
			<li>
				<span>${data.intelligence}</span>
				<button onclick="addStatus(${data.intelligence})"><img src="public\\assets\\img\\menuIcons\\add.png"></button>
			</li>
			<li>
				<span>${data.defense}</span>
				<button onclick="addStatus(${data.defense})"><img src="public\\assets\\img\\menuIcons\\add.png"></button>
			</li>
			<li>
				<span>${data.strength}</span>
				<button onclick="addStatus(${data.strength})"><img src="public\\assets\\img\\menuIcons\\add.png"></button>
			</li>
			<li>
				<span>${data.luck}</span>
				<button onclick="addStatus(${data.luck})"><img src="public\\assets\\img\\menuIcons\\add.png"></button>
			</li>
			<li>
				<span>${data.dexterity}</span>
				<button onclick="addStatus(${data.dexterity})"><img src="public\\assets\\img\\menuIcons\\add.png"></button>
			</li>
		</ul>
	</div>
	
	<div class="menuFooter">
		<a href="#">Fechar</a>
	</div>
	`;
}

function createInventoryMenu(data) {
	const menu = document.querySelector(".menu");

	menu.innerHTML = `
	</span class="title">Status</span>

	<div class="menuContent">
		<ul>`;

	Object.entries(data.inventory).forEach((item) => {
		const [key, value] = item;
		if (key == "name") {
			if (item.isEquiped == false) {
				component.innerHTML += `<li><span>${value}</span><button class="notEquiped">Equipar</button></li>`;
			} else {
				component.innerHTML += `<li><span>${value}</span><button class="equiped">Equipado</button></li>`;
			}
		}
	});

	`</ul>
	</div>
	
	<div class="menuFooter">
		<span onClick="exitMenu()">Fechar</span>
	</div>
	`;
}

function createSkillsMenu(data) {
	const menu = document.querySelector(".menu");

	menu.innerHTML = `
	</span class="title">Status</span>

	<div class="menuContent">
		<ul>`;

	Object.entries(data.skills).forEach((item) => {
		const [key, value] = item;
		if (key == "name") {
			component.innerHTML += `
			<li>
				<span>${value.toString().slice(0, 20)}</span>
				<buttton>Equipar</buttton>
			</li>`;
		}
	});

	`</ul>
	</div>
	
	<div class="menuFooter">
		<span onClick="exitMenu()">Fechar</span>
	</div>
	`;
}

function exitMenu() {
	const menu = document.querySelector(".menu");
	const card = document.querySelector(".card");

	menu.classList.add("hiddenComponet");
	card.classList.remove("hiddenComponet");

	menu.innerHTML = "";
}

function regenHp() {
	if (dataPlayer.hp == JSON.parse(sessionStorage.getItem("player")).hp || isBatle) {
		return;
	}

	setTimeout(() => {
		dataPlayer.hp += 0.5;
		// dataPlayer.hp += vitality;
	}, 1000);
}

function regenMp() {
	if (dataPlayer.mp == JSON.parse(sessionStorage.getItem("player")).mp) {
		return;
	}

	setTimeout(() => {
		dataPlayer.mp += (dataPlayer.mp * dataPlayer.intelligence) / 100;
	}, 1000);
}

function updateBattleStatus(player, enemie) {
	const statusBatle = setInterval(() => {
		if (!isBatle) {
			clearInterval(statusBatle);
			return;
		}

		insertCardContent(`
			<div class="batleInfo">
				<div class="enemy">
					<span class="title">Name: ${enemie.name}</span>
					<span class="hp">HP: ${enemie.hp < 0 ? 0 : enemie.hp.toString().slice(0, 4)}</span>
				</div>
				<div class="player">
					<span class="title">Name: ${player.name}</span>
					<span class="hp">HP: ${player.hp < 0 ? 0 : player.hp.toString().slice(0, 4)}</span>
					<span class="mp">MP: ${player.mp < 0 ? 0 : player.mp.toString().slice(0, 4)}</span>
				</div>
			</div>
			`);
	}, 1000);
}

function updateBattleLog(message) {
	const card = document.querySelector(".card");
	const log = document.createElement("span");

	log.className = "log";
	log.innerText = message;

	card.innerHTML += "<div class='batleLog'></div>";
	const batleLog = document.querySelector(".batleLog");

	batleLog.insertAdjacentElement("beforeend", log);
}

function logout() {
	sessionStorage.clear();
	window.location = "/";
}

/**
 * Caso o ataque tenha algum efeito aplicavel, chamar a função de aplicação de efeito
 */

/*
  <div class="menu">
    <div class="menuHeader">
      <button id="btnClose">X</button>
      <span class="title">Menu</span>
    </div>
    <div class="menuContent">
      <ul class="menuList">
        <li class="menuListItem"><button>Status</button></li>
        <li class="menuListItem"><button>Habilidades</button></li>
        <li class="menuListItem"><button>Inventário</button></li>

        <li class="menuListItem">
          
          <div class="status">
            <span>hp</span>
            <input type="number" value="10">
          </div>
          

          <div class="skills">
            <img src="public/assets/img/mage_icon.png" alt="icone da skills">
            <span>Fireball</span>
          </div>
          <button id="addStatus">+</button>
        </li>
      </ul>
    </div>
    <div class="menuFooter">
      <span>Sombras da Eternidade</span>
    </div>
  </div>
*/
