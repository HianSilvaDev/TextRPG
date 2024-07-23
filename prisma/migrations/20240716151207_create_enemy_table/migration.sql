-- CreateTable
CREATE TABLE "enemy" (
    "enemy_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "spawnrate" REAL NOT NULL,
    "hp" INTEGER NOT NULL,
    "mp" INTEGER NOT NULL,
    "strength" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL,
    "dexterity" INTEGER NOT NULL,
    "resistance" INTEGER NOT NULL,
    "intelligence" INTEGER NOT NULL,
    "luck" INTEGER NOT NULL
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
    "atb" TEXT,
    "enemyEnemy_id" INTEGER,
    CONSTRAINT "item_enemyEnemy_id_fkey" FOREIGN KEY ("enemyEnemy_id") REFERENCES "enemy" ("enemy_id") ON DELETE SET NULL ON UPDATE CASCADE
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
    "interval" REAL,
    "enemyEnemy_id" INTEGER,
    CONSTRAINT "skill_enemyEnemy_id_fkey" FOREIGN KEY ("enemyEnemy_id") REFERENCES "enemy" ("enemy_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_skill" ("cooldown", "cost", "desc", "duration", "effect", "id_skill", "interval", "name", "power", "type") SELECT "cooldown", "cost", "desc", "duration", "effect", "id_skill", "interval", "name", "power", "type" FROM "skill";
DROP TABLE "skill";
ALTER TABLE "new_skill" RENAME TO "skill";
CREATE UNIQUE INDEX "skill_name_key" ON "skill"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "enemy_name_key" ON "enemy"("name");
