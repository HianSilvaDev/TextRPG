const prisma = require("./prismaClient");

async function cadSkill() {
  try {
    await prisma.skill.create({
      data: {
        name: "Escudo de Água",
        desc: "Cria um escudo de água que absorve parte do dano recebido por um curto período.",
        class: "mage",
        power: 0.0,
        cooldown: 8.0,
        cost: 5.0,
        effect: "Absorção de dano",
        type: "Defensivo",
        duration: 5.0,
        interval: null,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  cadSkill,
};
