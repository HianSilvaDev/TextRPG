-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Player" (
    "userId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "level" INTEGER,
    "hp" INTEGER NOT NULL,
    "mp" INTEGER NOT NULL,
    "vitality" INTEGER,
    "strength" INTEGER NOT NULL,
    "statuspoint" INTEGER NOT NULL DEFAULT 0,
    "defense" INTEGER NOT NULL,
    "dexterity" INTEGER NOT NULL,
    "resistance" INTEGER NOT NULL,
    "intelligence" INTEGER NOT NULL,
    "luck" INTEGER NOT NULL,
    "wallet" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "Player_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Player" ("class", "defense", "dexterity", "hp", "intelligence", "level", "luck", "mp", "name", "resistance", "strength", "userId", "vitality", "wallet") SELECT "class", "defense", "dexterity", "hp", "intelligence", "level", "luck", "mp", "name", "resistance", "strength", "userId", "vitality", "wallet" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
CREATE UNIQUE INDEX "Player_name_key" ON "Player"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
