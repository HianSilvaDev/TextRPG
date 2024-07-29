-- CreateTable
CREATE TABLE "EnemySkills" (
    "enemyId" INTEGER NOT NULL,
    "skillId" INTEGER NOT NULL,

    PRIMARY KEY ("enemyId", "skillId"),
    CONSTRAINT "EnemySkills_enemyId_fkey" FOREIGN KEY ("enemyId") REFERENCES "enemy" ("enemy_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EnemySkills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skill" ("id_skill") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "save" (
    "playerId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playerCords" TEXT NOT NULL,
    "currentXp" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "save_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
