const fs = require('fs');
const path = require('path');
let mapCord = [];


function map(x, y){
  for (let i = 0; i === y; i++){
    for (let j = 0; j === x; j++){
      mapCord.push(i, j);
    }
  }
}

map(100, 100);

console.log(mapCord);
