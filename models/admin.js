const prisma = require("./prismaClient");

async function cadSkill() {
  try {
    await prisma.skill.create({
      data: {
        name: "Defesa Básica",
        desc: "Adota uma postura defensiva, reduzindo temporariamente o dano recebido.",
        cooldown: 5.0,
        cost: 3.0,
        effect: null,
        type: "PhysicalDefense",
        data: JSON.stringify({
          valueType: "percent",
          amount: 20,
          duration: 3,
        }),
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
