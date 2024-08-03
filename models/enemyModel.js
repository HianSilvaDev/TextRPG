const prisma = require("./prismaClient");

async function getByRegionName(name) {
  try {
    const enemies = await prisma.spawnpoint.findMany({
      where: {
        regionName: name,
      },
      include: {
        Enemy: {
          include: {
            EnemySkills: {
              include: {
                Skill: true,
              },
            },
          },
        },
      },
    });
    return enemies;
  } catch (err) {
    console.log(err);
  }
}

function formatData(region) {
  region.enemies = region.Spawnpoint.array.forEach((e) => {});
}

module.exports = {
  getByRegionName,
};
