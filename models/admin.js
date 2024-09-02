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

async function cadSkill() {
  try {
    await prisma.skill.createMany({
      data: [
        {
          name: "Corte Profundo",
          desc: "Um corte profundo com a espada que causa dano elevado e aumenta a chance de sangramento nos inimigos.",
          cooldown: 7.5,
          cost: 25,
          effect: JSON.stringify({
            accuracy: 75,
            type: "bleed",
            duration: 4,
            damage: 20,
          }),
          type: "ATAQUE_FISICO",
          data: JSON.stringify({
            damage: 55,
            accuracy: 80,
          }),
        },
      ],
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  createItens,
  getAllItens,
  cadSkill,
};
