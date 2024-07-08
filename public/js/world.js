const coordinates = document.getElementById("coordinates")
const txt = document.querySelector(".txt")

coordinates.textContent = '--,--'

let cordinatesX = 3;
let cordinatesY = 3;
let currentRegion;

const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d', {willReadFrequently: true});
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
    console.log(color)
    return colorToLocality[color] || currentRegion;
}

img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
};

function limitValue(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function newCordinates(newx, newy) {

    x = cordinatesX + newx;
    y = cordinatesY + newy;

    if (x < 1 || x >= canvas.width || y < 0 || y >= canvas.height) {
        console.log("Out of Bonds!")
    }else{
        cordinatesX = limitValue(x, 1, canvas.width - 1);
        cordinatesY = limitValue(y, 1, canvas.height - 1);
        currentRegion = getLocalityNameByColor(cordinatesX, cordinatesY);
        update();
    }
}


function update(){
    coordinates.textContent = cordinatesX + ", " + cordinatesY;
    txt.textContent = currentRegion;
};