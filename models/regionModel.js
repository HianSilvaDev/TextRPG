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
              },
            },
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

  const organizedData = { ...region };

  organizedData.enemies = [];

  region.Spawnpoint.forEach((spawnpoint) => {
    const enemy = spawnpoint.Enemy;

    if (enemy) {
      const organizedEnemy = {
        ...enemy,
        skills: enemy.EnemySkills.map((enemySkill) => ({
          id: enemySkill.Skill.id_skill,
          name: enemySkill.Skill.name,
          description: enemySkill.Skill.desc,
          class: enemySkill.Skill.class,
          cooldown: enemySkill.Skill.cooldown,
          cost: enemySkill.Skill.cost,
          effect: enemySkill.Skill.effect,
          type: enemySkill.Skill.type,
          data: JSON.parse(enemySkill.Skill.data),
        })),
      };
      delete organizedEnemy.EnemySkills;
      organizedData.enemies.push(organizedEnemy);
    }
  });

  delete organizedData.Spawnpoint;

  return organizedData;
}

module.exports = {
  getByName,
};
