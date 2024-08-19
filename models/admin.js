const prisma = require("./prismaClient");

async function getAllItens() {
  try {
    return await prisma.item.findMany();
  } catch (error) {
    console.log(error);
  }
}

async function createItens() {
  try {
    await prisma.item.createMany({});
  } catch (error) {
    console.log(error);
  }
}

async function createEnemies() {
  try {
    await prisma.enemy.createMany({});
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  createItens,
  getAllItens,
};
