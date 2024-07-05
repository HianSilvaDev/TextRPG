const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/players.json');

class Player{
  constructor(id, name, classe = {}){
    this.id = id;
    this.name = name;
    this.level = 1;
    this.wallet = 0;
    this.applyClass(classe)
  }
  
  static applyClass(classe) {
    for(let key in classe){
      this[key] = classe[key];
    }
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(data));
        }
      })
    })
  }

  static saveAll(users){
    return new Promise(async (resolve, reject) => {
      fs.writeFile(filePath, JSON.stringify(users), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    })
  }

  save(){
    return new Promise(async (resolve, reject) => {
      try{
        const players = await Player.getAll();
        players.push(this);
        await Player.saveAll(players);
        resolve();
      }catch(err){
        reject(err);
      }
    })
  }
  
  static getById(id){
    return new Promise(async (resolve, reject) => {
      try{
        const players = await Player.getAll();
        const player = players.find(p => p.id === id);
        resolve(player);
      }catch(err){
        reject(err);
      }
    })
  }

  static uptade(player){
    return new Promise(async (resolve, reject) => {
      try{
        const players = await Player.getAll();
        const index = players.findIndex(p => p.id === player.id);
        players[index] = player;
        await Player.saveAll(players);
        resolve();
      }catch(err){
        reject(err);
      }
    })
  }
  
}

module.exports = Player;