if (!sessionStorage.getItem("data")) window.location = "/";
import { Player } from "./objects/player.js";

const username = document.getElementById("username");
const className = document.getElementById("class");
const level = document.getElementById("lvl");
const gold = document.getElementById("gold");
const list = document.querySelectorAll(".listing");

window.onload = function () {
	try {
		username.innerHTML = "carregando...";
		className.innerHTML = "carregando...";
		level.innerHTML = "carregando...";
		gold.innerHTML = "carregando...";
		list.innerHTML = "carregando...";
		const player = new Player(JSON.parse(sessionStorage.getItem("data")));
		info(player);
	} catch (error) {
		console.error(error);
	}
};

const btnInventory = document.getElementById("btnInventory");

function listing(component, data, isListingSkills) {
	Object.entries(data).forEach((item) => {
		const [key, value] = item;

		if (isListingSkills === true) {
			component.innerHTML += `<li>${value.name}</li>`;
		} else {
			if (key !== "skills" && key !== "class") {
				component.innerHTML += `<li><span class="title">${key}:</span> ${value}</li>`;
			}
		}
	});
}

/**
 * adicionar ao elemento um valor de acordo com a classe do player
 * @param {*} element
 * @param {String} text
 */
function addElementValue(element, text) {
	element.textContent = text;
}

btnInventory.addEventListener("click", () => {
	const inventory = document.getElementById("inventory");
	inventory.classList.toggle("hiddenComponet");
});

async function info(player) {
	// const player = await new Player(parseInt(JSON.parse(sessionStorage.getItem("data"))));
	const dataPlayer = await player.getData();

	addElementValue(username, dataPlayer.name);
	addElementValue(className, dataPlayer.class);
	addElementValue(level, `lvl: ${dataPlayer.level ?? 0}`);
	addElementValue(gold, `# ${dataPlayer.wallet}`);

	listing(list[0], player.getStatus(), false);

	listing(list[1], player.getAllSkills(), true);
}
