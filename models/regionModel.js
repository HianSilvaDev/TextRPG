const prisma = require("./prismaClient");

async function getByName(regionName) {
  try {
    const region = await prisma.region.findUnique({
      where: {
        name: regionName,
      },
      include: {
        Spawnpoint: {
          include: {
            Enemy: {
              include: {
                Loot: {
                  include: {
                    Item: true,
                  },
                },
              },
              include: {
                EnemySkills: {
                  include: {
                    Skill: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return region
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getByName
}
