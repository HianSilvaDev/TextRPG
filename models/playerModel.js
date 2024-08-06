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
    return player;
  } catch (err) {
    console.log(err);
  }
}
module.exports = {
  getbyId,
};
