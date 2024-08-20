const openMenu = document.getElementById("openMenu");

const containerContent = document.querySelector(".content");

let cordinatesX = 1;
let cordinatesY = 1;
let dataCurrentRegion;

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
 * @param {Array|Object} data
 */
function checkTypeOfNarrationToBePrinted(data) {
	let messages = "";
	let spawn;
	const d40 = Math.floor(Math.random() * 40);

	messages = data.EventPhrase.filter((events) => events.eventType === "no_item_found");

	if (d40 <= 10) {
		spawn = raffleMob(data.enemies);
		messages = data.EventPhrase.filter((events) => events.eventType === "encounter_enemy");
	}

	if (d40 > 10 && d40 <= 20) {
		spawn = raffleDrop(data.findableItens);
		messages = data.EventPhrase.filter((events) => events.eventType === "find_item");
	}

	printNarration(messages, spawn);
}

/**
 * Faz a troca do nome padrão para o do spawn
 *
 * @param {String} message
 * @param {String} spawnName
 * @returns String
 */
function printedReplace(message, spawnName) {
	let newMessage;

	if (message.includes("[nome do inimigo]")) {
		newMessage = message.replace("[nome do inimigo]", spawnName);
	}

	if (message.includes("[nome do item]")) {
		newMessage = message.replace("[nome do inimigo]", spawnName);
	}

	return newMessage;
}

/**
 * Printar narração para o usúario
 *
 * @param {string} messages
 * @param {Array|Object|string} spawn
 */
function printNarration(messages, spawn = "") {
	const txt = document.getElementById("narrations");

	const indexMessage = Math.floor(Math.random() * messages.length);
	let message = messages[indexMessage].text;

	if (spawn != "") {
		message = printedReplace(messages[indexMessage].text, spawn.name);
	}

	txt.textContent = message;
}

// buncando dados da classe player
function getPlayer(callback) {
	try {
		fetch(`/player?id=${parseInt(sessionStorage.getItem("data"))}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.log(error.message);
	}
}

/**
 * Sortear um mob com base na sorte do player e a raridade do mob
 *
 * @param {Array} mobs
 * @returns Object|Null
 */
function raffleMob(mobs) {
	let spawnMob;
	const totalChance = mobs.reduce((total, mob) => total + mob.spawnrate, 0);
	const choice = Math.round(Math.random() * totalChance);
	let accumulated = 0;

	for (const mob of mobs) {
		accumulated += mob.spawnrate;
		if (choice <= accumulated) {
			spawnMob = mob;
		}
	}

	return spawnMob;
}

/**
 * Sortear um drops com base na sorte do player e a raridade do mob
 *
 * @param {Array} drops
 * @returns Object|Null
 */
function raffleDrop(drops) {
	let spawnDrop;
	const totalChance = drops.reduce((total, drop) => total + drop.spawnrate, 0);
	const choice = Math.round(Math.random() * totalChance);
	let accumulated = 0;

	for (const drop of drops) {
		accumulated += drop.spawnrate;
		if (choice <= accumulated) {
			spawndrop = drop;
		}
	}

	return spawnDrop;
}

/**
 * buscando dados da região
 *
 * @param {string} region
 * @returns {Object|Array}
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
			dataCurrentRegion = data;

			insertCardContent(`
        <div class="cardText">
          <p class="description">
            ${dataCurrentRegion.desc}
          </p>
        </div>
        `);
		})
		.catch((error) => {
			console.error("Error: ", error);
		});
}

// Impede que o player se mova
function directionsBlock() {
	const btnDirections = document.querySelectorAll(".btnDirections");

	btnDirections.forEach((element) => {
		element.disabled = true;
	});
}

/**
 * Injeta conteúdo no card
 *
 * @param {*} content
 */
function insertCardContent(content) {
	const card = document.querySelector(".card");

	card.innerHTML = "";
	card.innerHTML += content;
}

openMenu.addEventListener("click", () => {
	console.log("openMenu");
	return;

	card.classList.add("hiddenComponet");

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
 * @param {Array} menuContent
 */
function createMenu(menuContent) {
	`
	</span class="title">${menuContent.title}</span>

	<div class="menuContent"></div>
	`;
}

function createAndInsertElement(
	element,
	className,
	idName = "",
	elementText = "",
	insert,
	position
) {
	const newElement = document.createElement(element);

	if (className !== "") {
		newElement.classList.add(className);
	}

	if (idName !== "") {
		newElement.setAttribute("id", idName);
	}

	if (elementText !== "") {
		newElement.textContent = elementText;
	}

	insert.insertAdjacentElement(position, newElement);

	return newElement;
}

function contentMenu(insert, insertIn) {
	insert.forEach((item) => {
		const listItem = createAndInsertElement("li", "menuListItem", "", "", insertIn, "beforeend");
		const listItemBtn = createAndInsertElement("button", "", "", item, listItem, "beforeend");
	});
}

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
