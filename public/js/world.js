const coordinates = document.getElementById("coordinates")
const txt = document.querySelector(".txt")

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
    "rgb(51, 119, 85)": "Floresta",
    "rgb(85, 153, 68)": "Clareira",
    "rgb(182, 45, 45)": "Cidade",
    "rgb(204, 255, 51)": "Vilarejo",
    "rgb(255, 255, 255)": "Topo da Montanha",
    "rgb(153, 170, 119)": "Pé da Montanha",
    "rgb(51, 102, 153)": "Lago ou rio"
};

function getPixelColor(x, y) {
    const imageData = ctx.getImageData(x, y, 1, 1).data;
    return `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;
}

function getLocalityNameByColor(x, y) {
    const color = getPixelColor(x, y);
    return colorToLocality[color] || currentRegion;
}

img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
};

function newCordinates(newx, newy){
    cordinatesX = cordinatesX + newx;
    cordinatesY = cordinatesY + newy;
    currentRegion = getLocalityNameByColor(cordinatesX, cordinatesY);
    update();
};

function update(){
    coordinates.textContent = cordinatesX + ", " + cordinatesY;
    txt.textContent = currentRegion;
};