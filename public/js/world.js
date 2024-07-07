const coordinates = document.getElementById("coordinates")
const txt = document.querySelector(".txt>p")
const openMenu = document.getElementById('openMenu')
const card      = document.querySelector('.card')
const containerContent = document.querySelector('.content')

coordinates.textContent = '--,--'

let cordinatesX = 550;
let cordinatesY = 100;
let currentRegion;

const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = '/public/assets/img/2DMAP.png';

img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
};

const colorToLocality = {
    "rgb(51, 119, 85)": "Floresta da Perdição",
    "rgb(85, 153, 68)": "Clareira",
    "rgb(182, 45, 45)": "Cidade",
    "rgb(204, 255, 51)": "Vilarejo",
    "rgb(255, 255, 255)": "Topo da Montanha",
    "rgb(153, 170, 119)": "Pé da Montanha",
    "rgb(51, 102, 153)": "Lago ou rio"
};

img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
};

openMenu.addEventListener('click',()=>{

    card.classList.add('hiddenComponet')
    const menu = createMenu()
    
    const closeMenu = document.getElementById('btnClose')
    
    closeMenu.addEventListener('click',()=>{
        card.classList.remove('hiddenComponet')
        // menu.classList.add('hiddenComponet')
        
        containerContent.removeChild(menu)

    })
})

function getPixelColor(x, y) {
    const imageData = ctx.getImageData(x, y, 1, 1).data;
    return `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;
}

function getLocalityNameByColor(x, y) {
    const color = getPixelColor(x, y);
    return colorToLocality[color] || currentRegion;
}

function newCordinates(newx, newy){
    cordinatesX = cordinatesX + newx;
    cordinatesY = cordinatesY + newy;
    currentRegion = getLocalityNameByColor(cordinatesX, cordinatesY);
    update();
};

function update(){
    coordinates.textContent = `${cordinatesX} , ${cordinatesY}`;
    txt.textContent = currentRegion;
};

function createMenu()
{   

    if(document.querySelector('.menu')){
        return
    }

    const containerContent = document.querySelector('.content')
    const itemForListing = ['Status','Habilidades','Inventário']

    const menu      = createAndInsertElement('div','menu','','',containerContent,'beforeend')

    const header    = createAndInsertElement('div','menuHeader','','',menu,'beforeend')
    const close     = createAndInsertElement('button','','btnClose','X',header,'beforeend')
    const title     = createAndInsertElement('span','title','','Menu',header,'beforeend')

    const content   = createAndInsertElement('div','menuContent','','',menu,'beforeend')
    const list      = createAndInsertElement('ul','menuList','','',content,'beforeend')

    itemForListing.forEach((item)=>{

        const listItem  = createAndInsertElement('li','menuListItem','','',list,'beforeend')
        const listItemBtn  = createAndInsertElement('button','','',item,listItem,'beforeend')
    })

    const footer        = createAndInsertElement('div','menuFooter','','',menu,'beforeend')
    const textFooter    = createAndInsertElement('span','','','Sombras da Eternidade',footer,'beforeend')

    return menu
}

function createAndInsertElement(element,className,idName = '',elementText = '',insert,position)
{
    const newElement = document.createElement(element)

    if(className !== '')
    {
        newElement.classList.add(className)
    }

    if(idName !== '')
    {
        newElement.setAttribute('id',idName)
    }

    if(elementText !== '')
    {
        newElement.textContent = elementText
    }

    insert.insertAdjacentElement(position,newElement)

    return newElement
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