/*
  Warnings:

  - You are about to drop the column `enemyEnemy_id` on the `item` table. All the data in the column will be lost.
  - You are about to drop the column `enemyEnemy_id` on the `skill` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Loot" (
    "enemyId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,

    PRIMARY KEY ("enemyId", "itemId"),
    CONSTRAINT "Loot_enemyId_fkey" FOREIGN KEY ("enemyId") REFERENCES "enemy" ("enemy_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Loot_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item" ("item_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_item" (
    "item_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "url_img" TEXT,
    "effect" TEXT,
    "type" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "class" TEXT,
    "atb" TEXT
);
INSERT INTO "new_item" ("atb", "class", "desc", "effect", "item_id", "name", "price", "type", "url_img") SELECT "atb", "class", "desc", "effect", "item_id", "name", "price", "type", "url_img" FROM "item";
DROP TABLE "item";
ALTER TABLE "new_item" RENAME TO "item";
CREATE UNIQUE INDEX "item_name_key" ON "item"("name");
CREATE TABLE "new_skill" (
    "id_skill" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "power" REAL NOT NULL,
    "cooldown" REAL NOT NULL,
    "cost" REAL NOT NULL,
    "effect" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "duration" REAL,
    "interval" REAL
);
INSERT INTO "new_skill" ("cooldown", "cost", "desc", "duration", "effect", "id_skill", "interval", "name", "power", "type") SELECT "cooldown", "cost", "desc", "duration", "effect", "id_skill", "interval", "name", "power", "type" FROM "skill";
DROP TABLE "skill";
ALTER TABLE "new_skill" RENAME TO "skill";
CREATE UNIQUE INDEX "skill_name_key" ON "skill"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
