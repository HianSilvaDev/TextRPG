const prisma = require("./prismaClient");

async function getByName(regionName) {
  try {
    const region = await prisma.region.findUnique({
      where: {
        name: regionName,
      },
      include: {
        EventPhrase: true,
        Spawnpoint: {
          include: {
            Enemy: {
              include: {
                EnemySkills: {
                  include: {
                    Skill: true,
                  },
                },
                Loot: {
                  include: {
                    item: true,
                  },
                },
              },
            },
          },
        },
        RegionItens: {
          include: {
            Item: true,
          },
        },
      },
    });
    return organizeRegionData(region);
  } catch (err) {
    console.log(err);
  }
}

function organizeRegionData(region) {
  if (!region) return null;

  const findableItems = region.RegionItens.map((i) => {
    return {
      ...i.Item,
      spawnrate: i.spawnrate,
    };
  });

  const organizedData = {
    ...region,
    findableItems,
  };

  organizedData.enemies = [];

  region.Spawnpoint.forEach((spawnpoint) => {
    const enemy = spawnpoint.Enemy;

    if (enemy) {
      let loot = enemy.Loot.map((i) => {
        return i.item;
      });
      const organizedEnemy = {
        ...enemy,
        loot,
        skills: enemy.EnemySkills.map((s) => {
          return s.Skill;
        }),
      };
      delete organizedEnemy.Loot;
      delete organizedEnemy.EnemySkills;
      organizedData.enemies.push(organizedEnemy);
    }
  });

  delete organizedData.Spawnpoint;
  delete organizedData.RegionItens;

  return organizedData;
}

module.exports = {
  getByName,
};
