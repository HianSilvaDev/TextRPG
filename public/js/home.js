if (!sessionStorage.getItem("data")) window.location = "/";
import { skill } from "../../models/prismaClient.js";
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
		console.log(player);
		info(player);
	} catch (error) {
		console.error(error);
	}
};
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

const btnInventory = document.getElementById("btnInventory");
btnInventory.addEventListener("click", () => {
	const inventory = document.getElementById("inventory");
	const painel = document.getElementById("painel");
	inventory.classList.remove("hiddenComponet");
	painel.classList.add("hiddenComponet");
});

const btnSkills = document.getElementById("btnSkills");
btnSkills.addEventListener("click", () => {
	const skills = document.getElementById("skills");
	const painel = document.getElementById("painel");
	skills.classList.remove("hiddenComponet");
	painel.classList.add("hiddenComponet");
});

// const btnclose = document.getElementsByClassName(".close");
// btnclose.addEventListener("click", () => {
// 	// const inventory = document.getElementById("inventory");
// 	const skills = document.getElementById("skills");
// 	// const painel = document.getElementById("painel");
// 	// inventory.classList.add("hiddenComponet");
// 	// skills.classList.add("hiddenComponet");
// 	// painel.classList.remove("hiddenComponet");
// 	console.log(skills.classList);
// });
async function info(player) {
	// const player = await new Player(parseInt(JSON.parse(sessionStorage.getItem("data"))));
	const dataPlayer = await player.getData();

	addElementValue(username, dataPlayer.name);
	addElementValue(className, dataPlayer.class);
	addElementValue(level, `lvl: ${dataPlayer.level ?? 0}`);
	addElementValue(gold, `# ${dataPlayer.wallet}`);

	// showStatus(player.getStatus());

	listing(list[0], player.getStatus());

	listing(list[1], player.getAllSkills(), true);
}

function showStatus(status) {}
