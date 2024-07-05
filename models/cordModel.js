const fs = require('fs');
const path = require('path');
console.log('mapModel.js');


const filePath = path.join(__dirname, '../data/map.json');

class Terrain {
    constructor(name){
        this.generateCord(name)
    }

    generateCord(name) {
        let matrix = [];
        for (let y = -50; y <= 50; y++) {
            for (let x = -50; x <= 50; x++) {
                matrix.push({
                    x: x,
                    y: y,
                    name: name
                });
            }
        }
        this.matrix = matrix;
    }

    static getAll(){
        return new Promise ( (resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(data));
                }
            })
        })
    }

    static saveAll(terrains){
        return new Promise ( (resolve, reject) => {
            fs.writeFile(filePath, JSON.stringify(terrains), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        })
    }

    save(){
        return new Promise ( async (resolve, reject) => {
            try{
                const terrains = await Terrain.getAll()
                terrains.push(this)
                await Terrain.saveAll(terrains)
                resolve()
            }catch(err){
                reject(err);
            }
        })
    }

    getByName(name){
        return new Promise ( async (resolve, reject) => {
            try{
                const terrains = await Terrain.getAll()
                const terrain = terrains.filter(t => t.name === name)
                resolve(terrain)
            }catch(err){
                reject(err);
            }
        })
    }

    static getByCordinates(x, y){
        return new Promise ( async (resolve, reject) => {
            try{
                const terrains = await Terrain.getAll()
                for(let terrain of terrains){
                    if(terrain.matrix.find(t => t.x === x && t.y === y)){
                        resolve(terrain)
                    }
                }
            }catch(err){
                reject(err);
            }
        })
    }
}


module.exports = Terrain;