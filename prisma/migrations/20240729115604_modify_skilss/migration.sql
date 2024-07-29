-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_skill" (
    "id_skill" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "class" TEXT,
    "power" REAL NOT NULL,
    "cooldown" REAL NOT NULL,
    "cost" REAL NOT NULL,
    "effect" TEXT,
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
