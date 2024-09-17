if (!sessionStorage.getItem("data")) window.location = "/";

let player;
window.onload = getPlayer;

const username = document.getElementById("username");
const className = document.getElementById("class");
const level = document.getElementById("lvl");
const gold = document.getElementById("gold");
const list = document.querySelectorAll(".listing");
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

function getPlayer() {
	try {
		fetch(`/player?id=${parseInt(sessionStorage.getItem("data"))}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.error) throw new Error(data.error);
				player = data;

				addElementValue(gold, `# ${player.wallet}`);
				addElementValue(username, player.name);
				addElementValue(className, player.class);
				addElementValue(level, `lvl: ${player.level ?? 0}`);

				listing(
					list[0],
					{
						hp: player.hp,
						mp: player.mp,
						strenght: player.strength,
						defense: player.defense,
						dexterity: player.dexterity,
						resistence: player.resistance,
						intelligence: player.intelligence,
						luck: player.luck,
					},
					false
				);

				listing(list[1], player.skills, true);
			});
	} catch (error) {
		console.log(error.message);
	}
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
