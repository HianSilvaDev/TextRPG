const coordinates = document.getElementById("coordinates")

coordinates.textContent = '--,--'

let coordinatesX = 0;
let coordinatesY = 0;

function newCoordinates(newX,newY)
{
  coordinatesX = coordinatesX + newX
  coordinatesY = coordinatesY + newY

  coordinates.textContent = `(${coordinatesX},${coordinatesY})`
}