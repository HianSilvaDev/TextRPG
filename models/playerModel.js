const prisma = require("./prismaClient.js");

async function getbyId(id) {
  try {
    let player = await prisma.player.findUnique({
      where: {
        userId: id,
      },
      include: {
        inventory: {
          include: {
            item: true,
          },
        },
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });
    return formatPlayer(player);
  } catch (err) {
    console.log(err);
  }
}

function formatPlayer(player) {
  let inventory = player.inventory.map((i) => {
    return {
      ...i.item,
      isEquiped: i.equiped,
      qtd: i.qtd,
    };
  });

  let skills = player.skills.map((s) => {
    return {
      ...s.skill,
      isEquiped: s.equiped,
    };
  });
  return {
    ...player,
    skills,
    inventory,
  };
}
module.exports = {
  getbyId,
};
