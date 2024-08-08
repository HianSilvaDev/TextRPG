const prisma = require("./prismaClient");

async function cadSkill() {
  try {
    await prisma.skill.createMany({
      data: [
        {
          name: "Investida",
          desc: "Uma carga rápida que causa dano e pode atordoar inimigos.",
          class: "Bárbaro",
          effect: JSON.stringify({ type: "stun", duration: 2 }),
          cooldown: 10.0,
          cost: 20.0,
          type: "ATAQUE_FISICO",
          data: JSON.stringify({ damage: 12, accuracy: 40 }),
        },
        {
          name: "Golpe Poderoso",
          desc: "Um ataque forte que causa grande dano ao alvo.",
          class: "Bárbaro",
          cooldown: 8.0,
          cost: 10.0,
          type: "ATAQUE_FISICO",
          data: JSON.stringify({ damage: 20, accuracy: 30 }),
        },
        {
          name: "Golpe Simples",
          desc: "Ataca com o machado causando dano ao alvo.",
          class: "Bárbaro",
          cooldown: 2.0,
          cost: 5.0,
          type: "ATAQUE_FISICO",
          data: JSON.stringify({ damage: 10, accuracy: 80 }),
        },
      ],
    });
  } catch (error) {
    console.log(error);
  }
}

async function seedEventPhrases() {
  await prisma.eventPhrase.createMany({});
}

async function createEnemy() {
  return await prisma.enemy.createMany({});
}

async function createItens() {
  return prisma.item.createMany({});
}
module.exports = {
  cadSkill,
  seedEventPhrases,
  createEnemy,
  createItens,
};
