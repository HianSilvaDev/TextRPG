-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PlayerItens" (
    "playerId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "qtd" INTEGER NOT NULL,
    "equiped" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("playerId", "itemId"),
    CONSTRAINT "PlayerItens_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlayerItens_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item" ("item_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PlayerItens" ("itemId", "playerId", "qtd") SELECT "itemId", "playerId", "qtd" FROM "PlayerItens";
DROP TABLE "PlayerItens";
ALTER TABLE "new_PlayerItens" RENAME TO "PlayerItens";
CREATE TABLE "new_PlayerSkill" (
    "playerId" INTEGER NOT NULL,
    "skillId" INTEGER NOT NULL,
    "equiped" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("playerId", "skillId"),
    CONSTRAINT "PlayerSkill_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlayerSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skill" ("id_skill") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PlayerSkill" ("playerId", "skillId") SELECT "playerId", "skillId" FROM "PlayerSkill";
DROP TABLE "PlayerSkill";
ALTER TABLE "new_PlayerSkill" RENAME TO "PlayerSkill";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
