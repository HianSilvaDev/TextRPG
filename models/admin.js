const prisma = require("./prismaClient");

async function cadSkill() {
  try {
    await prisma.skill.create({
      data: {
        region_name: "Escudo de Água",
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

async function seedEventPhrases() {
  await prisma.eventPhrase.createMany({
    data: [
      {
        region_name: "Floresta do Esquecimento",
        eventType: "find_item",
        text: "Um [nome do item] meio enterrado no solo desperta sua curiosidade.",
      },
      {
        region_name: "Floresta do Esquecimento",
        eventType: "find_item",
        text: "Você quase tropeça em um [nome do item], escondido sob a vegetação.",
      },
      {
        region_name: "Floresta do Esquecimento",
        eventType: "find_item",
        text: "Um [nome do item] reluz sob a luz do sol, chamando você para pegá-lo.",
      },
      {
        region_name: "Floresta do Esquecimento",
        eventType: "find_item",
        text: "Parece que a sorte sorriu para você hoje: um [nome do item] está bem à sua frente.",
      },
      {
        region_name: "Floresta do Esquecimento",
        eventType: "find_item",
        text: "Você se depara com um [nome do item] cuidadosamente colocado sobre uma pedra.",
      },
    ],
  });
}

module.exports = {
  cadSkill,
  seedEventPhrases,
};
