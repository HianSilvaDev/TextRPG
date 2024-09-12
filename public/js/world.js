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

	messages = data.EventPhrase.filter((events) => events.eventType === "no_item_found");

	if (d40 <= 10) {
		spawn = raffleMobOurItens(data.enemies);
		opponentData = spawn;
		createTheSpawnCard(spawn, ["lutar", "fugir"]);
		messages = data.EventPhrase.filter((events) => events.eventType === "encounter_enemy");
	}

	if (d40 > 10 && d40 <= 20) {
		spawn = raffleMobOurItens(data.findableItems);
		createTheSpawnCard(spawn, ["pegar", "ignorar"]);
		itemData = spawn;
		messages = data.EventPhrase.filter((events) => events.eventType === "find_item");
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
			// if (dataPlayer.dexterity * dataPlayer.luck < opponentData.dexterity * opponentData.luck) {
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

	updateBattleLog(dataPlayer, opponentData, "Inicio da batalha!");

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

	mobAtack(opponentData);
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
	let damage;
	const index = dataPlayer.skills.findIndex((p) => p.id_skill == skillId);
	const skill = dataPlayer.skills[index];

	if (dataPlayer.mp < skill.cost) {
		updateBattleLog(dataPlayer, opponentData, "Você não tem mp o sufiente");
		return;
	}

	e.target.style = "background: var(--btn-bg-2);";

	if (skill.isCooldown) {
		updateBattleLog(dataPlayer, opponentData, `${skill.name} está em tempo de recarga!`);
		return;
	}

	// skill.effect ? checkSkillTypeAndAplly("player", skill) : null;

	damage = calculateDamage(dataPlayer, JSON.parse(skill.data), opponentData);

	if (JSON.parse(skill.effect)) {
		const effect = JSON.parse(skill.effect);
		console.log(effect);
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

	opponentData.hp -= damage;
	if (damage >= 0) {
		updateBattleLog(dataPlayer, opponentData, `Você causou ${damage} de dano`);
	}
}

/**
 * gerencia os ataques dos mobs
 *
 * @param {object} mob
 */
function mobAtack(mob) {
	const mobIntervalAtacking = setInterval(async () => {
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

		// Randomiza a habilidade que o mob irá ultilizar para atacar
		let damage = 0;
		const skillsThatAreNotOnCooldown = mob.skills.filter((skill) => !skill.isCooldown);

		if (skillsThatAreNotOnCooldown.length > 0) {
			const skill = randomize(skillsThatAreNotOnCooldown);

			if (checkObjectAttribute(JSON.parse(skill.data).damage)) {
				damage = calculateDamage(mob, JSON.parse(skill.data), dataPlayer);
				dataPlayer.hp -= damage;
				updateBattleLog(dataPlayer, opponentData, `Você sofreu ${damage} de dano`);
			}

			if (checkObjectAttribute(skill.effect)) {
				console.log(skill.effect);
				return;
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
	if (!skillData.damage) {
		return;
	}

	damage =
		user.strength + skillData.damage >= 0 && typeof (user.strength + skillData.damage) === "number"
			? user.strength + skillData.damage
			: 0;
	/*
	user.shield
		? console.log((user.shield.porcentage * damage) / 100)
		: console.log(user, ": not shield");
	shield = user.shield ? damage - (user.shield.porcentage * damage) / 100 : damage;
*/

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

	switch (skill.type) {
		case "BUFF":
			if (JSON.parse(skill.data).buffTarget == "defense") {
				user.defense = user.defense + JSON.parse(skill.data).value;

				setTimeout(() => {
					user.defense = user.defense - JSON.parse(skill.data).value;
				}, JSON.parse(skill.data).duration * 1000);
			}
			break;

		case "DEBUFF":
			if (JSON.parse(skill.data).debuffType == "defense") {
				addressee.defense = addressee.defense - JSON.parse(skill.data).debuffValue;

				setTimeout(() => {
					addressee.defense = addressee.defense + JSON.parse(skill.data).debuffValue;
				}, JSON.parse(skill.data).duration * 1000);
			}
			break;

		case "ESCAPE":
			printNarration(`${user} conseguiu fugir!`);
			break;

		case "SHIELD":
			user.shield = { porcentage: 25, duration: 10 };
			s;

			console.log(dataPlayer);
			setTimeout(() => {
				delete user.shield;
			}, user.shield.duration * 1000);
			break;

		default:
			return;
			break;
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
			console.log(data);
			dataCurrentRegion = data;

			insertCardContent(`
        <div class="cardText">
          <span class = "title">${data.name ?? "Região Bloqueada"}</span>
          <p class="description">
            ${data.desc ?? "Essa região ainda não está disponivel para esploração"}
          </p>
        </div>
        `);
		})
		.catch((error) => {
			console.log("Error: ", error);
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
			dataPlayer = JSON.parse(sessionStorage.getItem("player"))
				? JSON.parse(sessionStorage.getItem("player"))
				: data;

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
	console.log("openMenu");
	return;

	const menu = createMenu(["Status", "Habilidades", "Inventário"]);
	const menuListItem = document.querySelectorAll(".menuListItem>button") ?? "";
	const closeMenu = document.getElementById("btnClose");

	menuListItem[0].addEventListener("click", () => {
		const list = menu.childNodes[1].childNodes[0];

		list.innerHTML = "";

		getPlayer((player) => {
			listItem = {
				hp: player.hp,
				mp: player.mp,
				strenght: player.strenght,
				defense: player.defense,
				dexterity: player.dexterity,
				resistence: player.resistence,
				intelligence: player.intelligence,
				luck: player.luck,
			};

			Object.entries(listItem).forEach((item) => {
				[key, value] = item;

				createAndInsertElement("li", "", "", `${key}: ${value}`, list, "beforeend");
			});
		});
	}) ?? "";

	menuListItem[1].addEventListener("click", () => {
		const list = menu.childNodes[1].childNodes[0];

		list.innerHTML = "";

		getPlayer((player) => {
			Object.entries(player.skills).forEach((item) => {
				[key, value] = item;

				createAndInsertElement("li", "", "", value.name, list, "beforeend");
			});
		});
	}) ?? "";

	console.log(menuListItem[0]);

	closeMenu.addEventListener("click", () => {
		card.classList.remove("hiddenComponet");

		containerContent.removeChild(menu);
	});
});

/**
 * Criar um menu para o usuário
 *
 * @param {Object} menuContent
 */
function createMenu(menuContent) {
	const menu = `
	</span class="title">${menuContent.title}</span>

	<div class="menuContent">
		${menuContent.content}
	</div>
	`;
}

function contentMenu(insert, insertIn) {
	insert.forEach((item) => {
		const listItem = createAndInsertElement("li", "menuListItem", "", "", insertIn, "beforeend");
		const listItemBtn = createAndInsertElement("button", "", "", item, listItem, "beforeend");
	});
}

function regenHp() {
	if (dataPlayer.hp == JSON.parse(sessionStorage.getItem("player")).hp || isBatle) {
		return;
	}

	setTimeout(() => {
		dataPlayer.hp += 0.5;
	}, 1000);
}

function regenMp() {
	if (
		(dataPlayer.mp == JSON.parse(sessionStorage.getItem("player")).mp && isBatle) ||
		dataPlayer.mp == JSON.parse(sessionStorage.getItem("player")).mp
	) {
		return;
	}

	setTimeout(() => {
		dataPlayer.mp += 0.5;
	}, 1000);
}

function updateBattleLog(player, enemie, message) {
	insertCardContent(`
		<div class="batleInfo">
			<div class="enemy">
				<span class="title">Name: ${enemie.name}</span>
				<span class="hp">HP: ${enemie.hp < 0 ? 0 : enemie.hp}</span>
			</div>
			<div class="player">
				<span class="title">Name: ${player.name}</span>
				<span class="hp">HP: ${player.hp < 0 ? 0 : player.hp}</span>
				<span class="mp">MP: ${player.mp < 0 ? 0 : player.mp}</span>
			</div>
		</div>
		<div class="batleLog">
			<p class = "log">${message}</p>
		</div>
		`);
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
