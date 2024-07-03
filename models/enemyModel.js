const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const filePath = path.join(__dirname, '../data/enemies.json');

class Enemy{
  constructor(atb){
    this.id = uuid.v4();
    this.applyAtb(atb);
  }

  static applyAtb(atb){
    for(let key in atb){
      this[key] = atb[key];
    }
  }

  static getAll(){
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

  static saveAll(enemies){
    return new Promise(async (resolve, reject) => {
      fs.writeFile(filePath, JSON.stringify(enemies), (err) => {
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
        const enemies = await Enemy.getAll();
        enemies.push(this);
        await Enemy.saveAll(enemies);
        resolve();
      }catch(err){
        reject(err);
      }
    })
  }

  getById(id){
    return new Promise(async (resolve, reject) => {
      try{
        const enemies = await Enemy.getAll();
        const enemy = enemies.find(e => e.id === id);
        resolve(enemy);
      }catch(err){
        reject(err);
      }
    })
  }

  getByRegion(region){
    return new Promise(async (resolve, reject) => {
      try{
        const enemies = await Enemy.getAll();
        const enemy = enemies.find(e => e.region === region);
        resolve(enemy);
      }catch(err){
        reject(err);
      }
    })
  }
  
}

module.exports = Enemy;