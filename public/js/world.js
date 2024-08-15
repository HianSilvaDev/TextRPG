const openMenu = document.getElementById("openMenu");
const card = document.querySelector(".card");
const containerContent = document.querySelector(".content");

let cordinatesX = 1;
let cordinatesY = 1;
let currentRegion;

const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true }); //retorna um objeto com metodos para desenhar no canvas
const img = new Image();
img.src = "./public/assets/2DMap.png";

img.onload = function () {
  //Quando a imagem for carregada, ajusta o tamanho do canvas ao tamanho da imagem e a desenha
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
};

const colorToLocality = {
  "rgb(0, 100, 0)": "Floresta do Esquecimento",
  "rgb(85, 153, 68)": "Clareira",
  "rgb(182, 45, 45)": "Cidade",
  "rgb(204, 255, 51)": "Vilarejo",
  "rgb(255, 255, 255)": "Topo da Montanha",
  "rgb(153, 170, 119)": "Pé da Montanha",
  "rgb(51, 102, 153)": "Lago ou rio",
};

function getLocalityNameByColor(x, y) {
  //Recebe a posição x e y do pixel e atribui a variavel color a cor do mesmo em formato rgb
  const imageData = ctx.getImageData(x, y, 1, 1).data;
  let color = `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;
  // Retorna o valor do objeto colorToLocality que possui a key igual a color
  return colorToLocality[color];
}
// atribui um valor minimo e maximo e se value infringir-los retorna value corrigido ao valor mais proximo dentro do intervalo definido.
function limitValue(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function newCordinates(newx, newy) {
  // Soma as cordenadas atuais do player com a adição do movimento
  let x = cordinatesX + newx;
  let y = cordinatesY + newy;
  // Confere se a nova posição esta dentro do permitido, sendo esse os limites do mapa.
  if (x < 1 || x >= canvas.width || y < 0 || y >= canvas.height) {
    // Se fora dos limites, Escreve "fora dos limites" no console e não muda a posição do player
    console.log("Out of Bonds!");
  } else {
    // Estando dentro dos limites, se necessario corrige as novas cordenadas aos limites do mapa e as atribui ao player
    cordinatesX = limitValue(x, 1, canvas.width - 1);
    cordinatesY = limitValue(y, 1, canvas.height - 1);
    // Recebe o nome da região com base nas novas cordenadas e verifica se é igual a atual. Se assim for, chama a função setNarrations, caso contrario busca a nova região no banco de dados
    let region = getLocalityNameByColor(cordinatesX, cordinatesY);
    if (!currentRegion || region != currentRegion.name) {
      getRegion(region);
    } else {
      setNarrations();
    }
  }
}

openMenu.addEventListener("click", () => {
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

        createAndInsertElement(
          "li",
          "",
          "",
          `${key}: ${value}`,
          list,
          "beforeend"
        );
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

function createMenu(menuContent) {
  if (document.querySelector(".menu")) {
    return;
  }

  const containerContent = document.querySelector(".content");

  const menu = createAndInsertElement(
    "div",
    "menu",
    "",
    "",
    containerContent,
    "beforeend"
  );

  const header = createAndInsertElement(
    "div",
    "menuHeader",
    "",
    "",
    menu,
    "beforeend"
  );
  const close = createAndInsertElement(
    "button",
    "",
    "btnClose",
    "X",
    header,
    "beforeend"
  );
  const title = createAndInsertElement(
    "span",
    "title",
    "",
    "Menu",
    header,
    "beforeend"
  );

  const content = createAndInsertElement(
    "div",
    "menuContent",
    "",
    "",
    menu,
    "beforeend"
  );
  const list = createAndInsertElement(
    "ul",
    "menuList",
    "",
    "",
    content,
    "beforeend"
  );

  contentMenu(menuContent, list);

  const footer = createAndInsertElement(
    "div",
    "menuFooter",
    "",
    "",
    menu,
    "beforeend"
  );
  const textFooter = createAndInsertElement(
    "span",
    "",
    "",
    "Sombras da Eternidade",
    footer,
    "beforeend"
  );

  return menu;
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
    const listItem = createAndInsertElement(
      "li",
      "menuListItem",
      "",
      "",
      insertIn,
      "beforeend"
    );
    const listItemBtn = createAndInsertElement(
      "button",
      "",
      "",
      item,
      listItem,
      "beforeend"
    );
  });
}

// Pegando dados da classe player
function getPlayer(callback) {
  try {
    fetch("/player/get")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        player = data;

        callback(player);
      });
  } catch (error) {
    console.log(error.message);
  }
}

let playersCurrentRegion;
let narrationsFromTheCurrentRegion = [];

/**
 * Pegar região - buscar narrações dentro do banco - filtrar narrações
 *
 * @param {string} region
 */
function getRegion(region) {
  fetch(`/region?name=${region}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data) currentRegion = data;
      if (data.error) throw data.error;
      if (!data) throw "Erro ao buscar região";
    })
    .catch((error) => {
      console.error("Error: ", error);
    });
}

/**
 * Printar narração para o usúario
 *
 * @param {string} narration
 */
function setNarrations() {
  let choice = Math.round(Math.random() * currentRegion.EventPhrase.length);
  choice = currentRegion.EventPhrase[choice];
  switch (choice.type) {
    case "no_item_found":
      console.log(choice.text);
      break;
    case "encounter_enemy":
      combat(choice);
      break;
    case "find_item":
      findItem(choice);
      break;
  }
}
function combat() {}

function findItem() {}

/**
 * Sortear um mob com base na sorte do player e a raridade
 *
 * @param {Array} mobs
 * @returns Object
 */
function raffleMob(mobs) {
  const totalChance = mobs.reduce((total, mob) => total + mob.spawnrate, 0);
  const choice = Math.round(random()) * totalChance;
  let accumulated = 0;

  for (const mob of mobs) {
    accumulated += mob.spawnrate;
    if (choice <= accumulated) {
      return mob;
    }
  }
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
