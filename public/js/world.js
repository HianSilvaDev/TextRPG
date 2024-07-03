const coordinates = document.getElementById("coordinates")

coordinates.textContent = '--,--'

function newCoordinates(x,y)
{
  let newCoordinatesX = x
  newCoordinatesX += x
  coordinates.textContent = `${x},${y}`
}