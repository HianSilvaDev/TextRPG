const fs = require('fs');
const path = require('path');

function getDbPath(db) {
  return path.resolve(path.join(__dirname, db + ".json"));
}

function readDb(dbPath) {
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

function writeDb(dbPath, data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function getAll(db) {
  const dbPath = getDbPath(db);
  return readDb(dbPath);
}

function addData(db, data) {
  const dbPath = getDbPath(db);
  const dbData = readDb(dbPath);
  dbData.push(data);
  writeDb(dbPath, dbData);
}

function getData(db, value, attribute) {
  const dbPath = getDbPath(db);
  const dbData = readDb(dbPath);
  switch (attribute) {
    case "id":
      return dbData.find(item => item.id === value);
    case "email":
      return dbData.find(item => item.email === value);
    case "nome":
      return dbData.find(item => item.nome === value);
    default:
      throw new Error("Atributo Desconhecido");
  }
}

function removeData(db, value, attribute) {
  const dbPath = getDbPath(db);
  let dbData = readDb(dbPath);
  switch (attribute) {
    case "id":
      dbData = dbData.filter(item => item.id !== value);
      break;
    default:
      throw new Error("Atributo Desconhecido");
  }
  writeDb(dbPath, dbData);
}

function updateData(db, newData, attribute) {
  const dbPath = getDbPath(db);
  let dbData = readDb(dbPath);

  switch (attribute) {
    case "id":
      dbData = dbData.map(item => (item.id === newData.id ? newData : item));
      break;
    default:
      throw new Error("Atributo Desconhecido");
  }
  writeDb(dbPath, dbData);
}

module.exports = {
  addData,
  getData,
  removeData,
  updateData,
  getAll
};
