/*
  Warnings:

  - You are about to drop the column `duration` on the `skill` table. All the data in the column will be lost.
  - You are about to drop the column `interval` on the `skill` table. All the data in the column will be lost.
  - You are about to drop the column `power` on the `skill` table. All the data in the column will be lost.
  - Added the required column `data` to the `skill` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_skill" (
    "id_skill" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "class" TEXT,
    "cooldown" REAL NOT NULL,
    "cost" REAL NOT NULL,
    "effect" TEXT,
    "type" TEXT NOT NULL,
    "data" TEXT NOT NULL
);
INSERT INTO "new_skill" ("class", "cooldown", "cost", "desc", "effect", "id_skill", "name", "type") SELECT "class", "cooldown", "cost", "desc", "effect", "id_skill", "name", "type" FROM "skill";
DROP TABLE "skill";
ALTER TABLE "new_skill" RENAME TO "skill";
CREATE UNIQUE INDEX "skill_name_key" ON "skill"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
