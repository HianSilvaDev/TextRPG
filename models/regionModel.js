const prisma = require("./prismaClient");

async function getByName(regionName) {
  try {
    const regionWithEnemies = await prisma.region.findUnique({
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
    if (regionWithEnemies) {
      const formattedRegion = {
        name: region.name,
        desc: region.desc,
        image_urls: region.image_urls,
        enemies: region.Spawnpoint.map((spawnpoint) => ({
          enemy_id: spawnpoint.Enemy.enemy_id,
          name: spawnpoint.Enemy.name,
          desc: spawnpoint.Enemy.desc,
          level: spawnpoint.Enemy.level,
          spawnrate: spawnpoint.Enemy.spawnrate,
          hp: spawnpoint.Enemy.hp,
          mp: spawnpoint.Enemy.mp,
          strength: spawnpoint.Enemy.strength,
          defense: spawnpoint.Enemy.defense,
          dexterity: spawnpoint.Enemy.dexterity,
          resistance: spawnpoint.Enemy.resistance,
          intelligence: spawnpoint.Enemy.intelligence,
          luck: spawnpoint.Enemy.luck,
          Loot: spawnpoint.Enemy.Loot,
          EnemySkills: spawnpoint.Enemy.EnemySkills,
        })),
      };
      console.log(formattedRegion);
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getByName
}
