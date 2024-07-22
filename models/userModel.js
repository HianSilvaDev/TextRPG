const fs = require("fs");
const path = require("path");
const uuid = require("uuid");

const filePath = path.join(__dirname, "../data/users.json");

class User {
  constructor(name, password, email) {
    this.id = uuid.v4();
    this.name = name;
    this.email = email;
    this.password = password;
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  }

  static saveAll(users) {
    return new Promise(async (resolve, reject) => {
      fs.writeFile(filePath, JSON.stringify(users), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  save() {
    return new Promise(async (resolve, reject) => {
      try {
        const users = await User.getAll();
        users.push(this);
        await User.saveAll(users);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  static getById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const users = await User.getAll();
        const user = users.find((u) => u.id === id);
        resolve(user);
      } catch (err) {
        reject(err);
      }
    });
  }

  static getByEmail(email) {
    return new Promise(async (resolve, reject) => {
      try {
        const users = await User.getAll();
        const user = users.find((u) => u.email === email);
        resolve(user);
      } catch (err) {
        reject(err);
      }
    });
  }

  static getByName(name) {
    return new Promise(async (resolve, reject) => {
      try {
        const users = await User.getAll();
        const user = users.find((u) => u.name === name);
        resolve(user);
      } catch (err) {
        reject(err);
      }
    });
  }

  static delete(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const users = await User.getAll();
        const index = users.findIndex((u) => u.id === id);
        users.splice(index, 1);
        await User.saveAll(users);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = User;
