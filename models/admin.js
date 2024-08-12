const prisma = require("./prismaClient");

async function cadSkill() {
  try {
    await prisma.skill.createMany({
      data: [
        {
          name: "Campo Convergente",
          desc: "Cria um campo mágico que regenera 5MP/s, dura 10s.",
          class: "Mago",
          cooldown: 20.0,
          cost: 15.0,
          type: "REGEN_MP",
          data: JSON.stringify({
            amount: 5,
            duration: 10,
            accuracy: 100,
          }),
        },
        {
          name: "Bola de Fogo",
          desc: "Lança uma bola de fogo que causa dano ao alvo.",
          class: "Mago",
          cooldown: 2.0,
          cost: 10.0,
          effect: JSON.stringify({
            type: "BURN",
            accuracy: 60,
            damage: 7,
            duration: 3,
          }),
          type: "MAGIC_ATTACK",
          data: JSON.stringify({ damage: 20, accuracy: 90 }), // Dados da habilidade: dano causado e taxa de acerto
        },
        {
          name: "Escudo de Água",
          desc: "Cria um escudo de água que absorve 25% do dano recebido por 10s.",
          class: "Mago",
          cooldown: 12.0,
          cost: 15.0,
          type: "SHIELD",
          data: JSON.stringify({
            amount: 25,
            valueType: "percent",
            duration: 10,
            accuracy: 95,
          }),
        },
        {
          name: "Choque",
          desc: "Dispara um raio de eletricidade que causa 25 de dano ao alvo. Chance de 30% de atordoar o alvo.",
          class: "Mago",
          cooldown: 30.0,
          effect: JSON.stringify({
            type: "STUN",
            duration: 3,
            accuracy: 30,
          }),
          cost: 40.0,
          type: "MAGIC_ATTACK",
          data: JSON.stringify({
            damage: 60,
            accuracy: 95,
          }),
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
