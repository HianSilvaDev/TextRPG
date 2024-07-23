/*
  Warnings:

  - Added the required column `qtd` to the `PlayerItens` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PlayerItens" (
    "playerId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "qtd" INTEGER NOT NULL,

    PRIMARY KEY ("playerId", "itemId"),
    CONSTRAINT "PlayerItens_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlayerItens_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item" ("item_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PlayerItens" ("itemId", "playerId") SELECT "itemId", "playerId" FROM "PlayerItens";
DROP TABLE "PlayerItens";
ALTER TABLE "new_PlayerItens" RENAME TO "PlayerItens";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
