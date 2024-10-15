if (!sessionStorage.getItem("data")) window.location = "/";

import { Player } from "./objects/player.js";
import { Enemy } from "./objects/enemy.js";

const player = new Player(JSON.parse(sessionStorage.getItem("data")));
let dataPlayer = player.getData();

const btnDirections = document.querySelectorAll(".btnDirections");
btnDirections.forEach((btn) => {
	btn.addEventListener("click", () => {
		let vector2 = JSON.parse(btn.value);
		newCordinates(vector2.x, vector2.y);
	});
});

let cordinatesX = 1;
let cordinatesY = 1;
let dataCurrentRegion;
let opponentData;
let isBatle = false;
let itemData;
let exp = 0;

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
};

// Busca o nome da região de acordo com a cor da cordenada
function getLocalityNameByColor(x, y) {
	//Recebe a posição x e y do pixel e atribui a variavel color a cor do mesmo em formato rgb
	const imageData = ctx.getImageData(x, y, 1, 1).data;
	let color = `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;
	// Retorna o valor do objeto colorToLocality que possui a key igual a color
	return colorToLocality[color];
}

/**
 * atribui um valor minimo e maximo, e se o valor infringir-los retorna o valor corrigido ao valor mais proximo dentro do intervalo definido.
 */
function limitValue(value, min, max) {
	return Math.min(Math.max(value, min), max);
}

// verificar depois a definição dessa função
function getPixelColor(x, y) {
	const imageData = ctx.getImageData(x, y, 1, 1).data;
	return `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;
}

/**
 * Define as cordenadas do players
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
		card += `<button OnClick="actionForBtn(${option})">${option}</button>`;
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
	const btnActions = document.querySelector(".actions");

	updateBattleLog("Inicio da batalha!");

	statusArena();
	const skills = dataPlayer.getSkillEquiped();
	skills.forEach((skill) => {
		btnActions.innerHTML += `<button onClick="skillToUse(${skill.id_skill},event)">${skill.name}</button>`;
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
	statusArena();
	const btnActions = document.querySelector(".actions");
	btnActions.innerHTML = "";

	printNarration(message);

	escapeAction();
	isBatle = false;
	updateLvl();
}

// pega os dados da skill que irá ser usada
function skillToUse(skillId, e) {
	const skill = player.setSkillToUse(skillId);

	e.target.style = "background: var(--btn-bg-2);";
	dataPlayer.mp -= skill.cost;

	if (player.skillDamageExist(skill)) {
		const damage = calculateDamage(dataPlayer, player.skillDamageExist(skill), opponentData);
	}

	if (player.skillEffectExist(skill)) {
		console.log(player.getSkillEffect(skill));
	}

	skill.isCooldown = true;
	setTimeout(() => {
		skill.isCooldown = false;
		e.target.style = "background: #1d282c;";
	}, skill.cooldown * 1000);

	if (checkObjectAttribute(dataPlayer.escape)) {
		printNarration(`${dataPlayer.name} conseguiu fugir da batalha`);
		delete dataPlayer.escape;
	}
}

/**
 * gerencia os ataques dos mobs
 *
 * @param {object} mob
 */
function mobAtack() {
	const enemy = new Enemy(opponentData, dataPlayer.level);
	opponentData = enemy.updateStatus();
	const mobIntervalAtacking = setInterval(async () => {
		if (!isBatle) {
			clearInterval(mobIntervalAtacking);
			return;
		}

		// Randomiza a habilidade que o mob irá ultilizar para atacar
		const skill = enemy.getSkill();

		if (skill) {
			if (opponentData.mp < skill.cost) {
				console.log(`O mp atual de ${mob.name} é ${mob.mp}`);
				return;
			}
			opponentData.mp -= skill.cost;

			if (enemy.skillDamageExist(skill)) {
				damage = calculateDamage(
					opponentData,
					enemy.setSkillDamage(JSON.parse(skill.data).damage),
					dataPlayer
				);
				dataPlayer.hp -= damage;
				updateBattleLog(`Você sofreu ${damage} de dano`);
			}
			if (enemy.skillEffectExist(skill)) {
				console.log(skill);
			}

			skill.isCooldown = true;
			const cooldown = skill.cooldown * 1000;

			await new Promise((resolve) =>
				setTimeout(() => {
					skill.isCooldown = false;
					resolve();
				}, cooldown)
			);
		} else {
			console.log("Todas as habilidades estão em cooldown. Aguardando...");
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
		if (checkObjectAttribute(opponentData.escape)) {
			printNarration(`${opponentData.name} conseguiu fugir da batalha`);
			delete opponentData.escape;
		}
	}, 1000);
}

function balanceMobStatus() {
	if (opponentData.level >= dataPlayer.level) return;

	const levelDiference = dataPlayer.level - opponentData.level;
	const percentHp = (opponentData.spawnrate * opponentData.hp) / 100;
	const percentMp = (opponentData.spawnrate * opponentData.mp) / 100;
	const percentStrength = (opponentData.spawnrate * opponentData.strength) / 100;
	const percentDefense = (opponentData.spawnrate * opponentData.defense) / 100;

	opponentData.hp = levelDiference * percentHp;
	opponentData.mp = levelDiference * percentMp;
	opponentData.strength = levelDiference * percentStrength;
	opponentData.defense = levelDiference * percentDefense;
}

/**
 * Função verifica quanto de dano será mitigado, após o calculo aplica o dano ao destinatário
 *
 * @param {Object} user
 * @param {Object} skillData
 * @param {Object} addressee
 */
function calculateDamage(user, skillDamage, addressee) {
	let damage = skillDamage + user.strength;

	if (checkObjectAttribute(addressee.shielding)) {
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
				console.log("bleed");
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
				addressee.defense = debuffingTheDefense(addressee.defense, JSON.parse(skill.data));

				reset = () => {
					addressee.defense = JSON.parse(sessionStorage.getItem("player")).defense;
				};
			}
			if (JSON.parse(skill.data).debuffType == "strength") {
				addressee.strenght = debuffingThestrength(addressee.strenght, JSON.parse(skill.data));

				reset = () => {
					addressee.strength = JSON.parse(sessionStorage.getItem("player")).strength;
				};
			}

			setTimeout(() => {
				reset();
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

function debuffingTheDefense(defense, skillDebuff) {
	let newDefense = defense;

	if (skillDebuff.type == "percent") {
		newDefense = defense - (skillDebuff.debuffValue * defense) / 100;
	}
	if (skillDebuff.type == "quantify") {
		newDefense = defense - skillDebuff.amount;
	}

	return newDefense;
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

function updateLvl() {
	const expBase = 120;
	const expRequired = expBase * dataPlayer.level;
	if (exp < expRequired) return;

	exp -= expRequired;
	dataPlayer.level += 1;

	if (checkObjectAttribute(dataPlayer.statuspoint)) {
		const data = sessionStorage.getItem("player");
		data.statuspoint += 3;
		dataPlayer.statuspoint += 3;
	}
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

const openMenu = document.getElementById("openMenu");
openMenu.addEventListener("click", () => {
	directionsBlock(true);
	createMenu({
		title: "Menu",
		content: `
			<ul>
				<li><button onClick="createStatusMenu()"><img src="public\\assets\\img\\menuIcons\\status.png"></button></li>
				<li><button onClick="createSkillsMenu()"><img src="public\\assets\\img\\menuIcons\\skills.png"></button></li>
				<li><button onClick="createInventoryMenu()"><img src="public\\assets\\img\\menuIcons\\inventory.png"></button></li>
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

function createStatusMenu() {
	const menu = document.querySelector(".menu");

	menu.innerHTML = `
	<span class="title">Status</span>

	<div class="menuContent">
		<ul>
			<li>
				<p>Vitalidade <span class="vitality">${dataPlayer.vitality}</span></p>
				<button onclick="updateStatus('vitality')"><img src="public\\assets\\img\\menuIcons\\add.png"></button>
			</li>
			<li>
				<p>Inteligencia <span class="intelligence">${dataPlayer.intelligence}</span></p>
				<button onclick="updateStatus('intelligence',)"><img src="public\\assets\\img\\menuIcons\\add.png"></button>
			</li>
			<li>
				<p>Defesa <span class="defense">${dataPlayer.defense}</span></p>
				<button onclick="updateStatus('defense')"><img src="public\\assets\\img\\menuIcons\\add.png"></button>
			</li>
			<li>
				<p>Força <span class="strength">${dataPlayer.strength}</span></p>
				<button onclick="updateStatus('strength')"><img src="public\\assets\\img\\menuIcons\\add.png"></button>
			</li>
			<li>
				<p>Sorte <span class="luck">${dataPlayer.luck}</span></p>
				<button onclick="updateStatus('luck')"><img src="public\\assets\\img\\menuIcons\\add.png"></button>
			</li>
			<li>
				<p>Destreza <span class="dexterity">${dataPlayer.dexterity}</span></p>
				<button onclick="updateStatus('dexterity')"><img src="public\\assets\\img\\menuIcons\\add.png"></button>
			</li>
			<li>
				<span>Pontos</span>
				<span>${dataPlayer.statuspoint}</span>
			</li>
		</ul>
	</div>
	
	<div class="menuFooter">
		<span onClick="exitMenu()">Fechar</span>
	</div>
	`;
}

function createInventoryMenu() {
	const menu = document.querySelector(".menu");

	menu.innerHTML = `
	<span class="title">Inventario</span>

	<div class="menuContent">
		<ul>`;

	dataPlayer.inventory.forEach((item) => {
		if (item.name) {
			if (item.isEquiped == false) {
				menu.innerHTML += `<li><span>${item.name}</span><button class="notEquiped" onClick="equipOrUnequipItem(${item.item_id})">Equipar</button></li>`;
			} else {
				menu.innerHTML += `<li><span>${item.name}</span><button class="equiped" onClick="equipOrUnequipItem(${item.item_id})">Equipado</button></li>`;
			}
		}
	});

	menu.innerHTML += `</ul>
	</div>
	
	<div class="menuFooter">
		<span onClick="exitMenu()">Fechar</span>
	</div>
	`;
}

function createSkillsMenu() {
	const menu = document.querySelector(".menu");

	menu.innerHTML = `
	<span class="title">Skills</span>

	<div class="menuContent">
		<ul>`;

	dataPlayer.skills.forEach((item) => {
		if (item.name) {
			if (item.isEquiped) {
				menu.innerHTML += `
				<li>
					<span>${item.name.toString().slice(0, 20)}</span>
					<button onClick="equipAndUnequipSkill(${item.id_skill})">Desequipar</button>
				</li>`;
			}

			if (!item.isEquiped) {
				menu.innerHTML += `
			<li>
				<span>${item.name.toString().slice(0, 20)}</span>
				<button onClick="equipAndUnequipSkill(${item.id_skill})">Equipar</button>
			</li>`;
			}
		}
	});

	menu.innerHTML += `</ul>
	</div>
	
	<div class="menuFooter">
		<span onClick="exitMenu()">Fechar</span>
	</div>
	`;
}

function updateStatus(status) {
	if (dataPlayer.statuspoint <= 0) return;
	const component = document.querySelector("." + status);
	const data = JSON.parse(sessionStorage.getItem("player"));
	let newValue = 0;

	switch (status) {
		case "vitality":
			newValue = parseInt(component.innerText) + 1;
			dataPlayer.vitality += 1;
			dataPlayer.hp += 10;

			data.vitality += 1;
			data.hp += 10;
		case "intelligence":
			newValue = parseInt(component.innerText) + 1;
			dataPlayer.intelligence += 1;
			dataPlayer.mp += 10;

			data.intelligence += 1;
			data.mp += 10;
			break;
		case "defense":
			newValue = parseInt(component.innerText) + 1;
			dataPlayer.defense += 1;
			data.defense += 1;
			break;
		case "strength":
			newValue = parseInt(component.innerText) + 1;
			dataPlayer.strength += 1;
			data.strength += 1;
			break;
		case "luck":
			newValue = parseInt(component.innerText) + 1;
			dataPlayer.luck += 1;
			data.luck += 1;
			break;
		case "dexterity":
			newValue = parseInt(component.innerText) + 1;
			dataPlayer.dexterity += 1;
			data.dexterity += 1;
			break;

		default:
			return;
			break;
	}

	sessionStorage.setItem("player", JSON.stringify(data));
	component.innerHTML = newValue;
}

function equipAndUnequipSkill(id) {
	const data = JSON.parse(sessionStorage.getItem("player"));
	dataPlayer.skills.forEach((skill) => {
		if (skill.id_skill == id)
			if (!skill.isEquiped)
				if (dataPlayer.skills.filter((item) => item.isEquiped == "true").length >= 5) return;

		if (skill.id_skill == id) skill.isEquiped = !skill.isEquiped;
	});
	data.skills.forEach((skill) => {
		if (skill.id_skill == id)
			if (!skill.isEquiped)
				if (data.skills.filter((item) => item.isEquiped == "true").length >= 5) return;

		if (skill.id_skill == id) skill.isEquiped = !skill.isEquiped;
	});

	createSkillsMenu();
	sessionStorage.setItem("player", JSON.stringify(data));
}

function equipOrUnequipItem(id) {
	const data = JSON.parse(sessionStorage.getItem("player"));
	dataPlayer.inventory.forEach((item) => {
		if (item.item_id == id) item.equiped = !item.equiped;
	});
	data.skills.forEach((skill) => {
		if (item.item_id == id) item.equiped = !item.equiped;
	});

	createInventoryMenu();
	sessionStorage.setItem("player", JSON.stringify(data));
}

function exitMenu() {
	const menu = document.querySelector(".menu");
	const card = document.querySelector(".card");

	menu.classList.add("hiddenComponet");
	card.classList.remove("hiddenComponet");

	menu.innerHTML = "";
	directionsBlock(false);
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

const batleStatus = setInterval(() => {
	if (!isBatle) {
		return;
	}
	if (opponentData.hp <= 0) {
		const data = JSON.parse(sessionStorage.getItem("player"));
		exitArena(`${dataPlayer.name} derrotou ${opponentData.name}`);
		exp += 20;
		dataPlayer.wallet += 5;
		data.wallet += 5;
		sessionStorage.setItem("player", JSON.stringify(data));
		clearInterval(batleStatus);
	}
	if (dataPlayer.hp <= 0) {
		const data = JSON.parse(sessionStorage.getItem("player"));
		dataPlayer.wallet -= 2;
		dataPlayer.hp = 0;
		data.hp = 0;
		sessionStorage.setItem("player", JSON.stringify(data));
		exitArena(`${opponentData.name} derrotou ${dataPlayer.name}`);
		clearInterval(batleStatus);
	}
}, 500);

function statusArena() {
	const painelBatle = document.querySelector(".painelBatle");
	const painelDefault = document.querySelector(".painel");

	painelBatle.classList.toggle("hiddenComponet");
	painelDefault.classList.toggle("hiddenComponet");
}
