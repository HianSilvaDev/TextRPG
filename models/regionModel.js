const { rejects } = require('assert');
const { resolve } = require('dns');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/regions.json');

class Region{
  constructor(name, descriptions, images){
    this.name = name;
    this.description = descriptions;
    this.image = images;
  }

  static getAll(){
    return new Promise ((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(data));
        }
      })
    })
  }

  static saveAll(regions){
    return new Promise(async (resolve, reject) => {
      fs.writeFile(filePath, JSON.stringify(regions), (err) => {
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
        const regions = await Region.getAll();
        regions.push(this);
        await Region.saveAll(regions);
        resolve();
      }catch(err){
        reject(err);
      }
    })
  }

  static getByName(name){
    return new Promise(async (resolve, reject) => {
      try{
        const regions = await Region.getAll();
        const region = regions.find(r => r.name === name);
        resolve(region);
      }catch(err){
        reject(err);
      }
    })
  }
}