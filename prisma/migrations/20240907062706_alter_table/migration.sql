-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_save" (
    "playerId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playerCords" TEXT NOT NULL,
    "currentXp" INTEGER NOT NULL DEFAULT 0,
    "necessaryXP" INTEGER NOT NULL DEFAULT 100,
    CONSTRAINT "save_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_save" ("currentXp", "playerCords", "playerId") SELECT "currentXp", "playerCords", "playerId" FROM "save";
DROP TABLE "save";
ALTER TABLE "new_save" RENAME TO "save";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
