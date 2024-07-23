-- AlterTable
ALTER TABLE "enemy" ADD COLUMN "desc" TEXT;

-- CreateTable
CREATE TABLE "Region" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "desc" TEXT NOT NULL,
    "image_urls" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Spawnpoint" (
    "regionName" TEXT NOT NULL,
    "enemyId" INTEGER NOT NULL,

    PRIMARY KEY ("regionName", "enemyId"),
    CONSTRAINT "Spawnpoint_regionName_fkey" FOREIGN KEY ("regionName") REFERENCES "Region" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Spawnpoint_enemyId_fkey" FOREIGN KEY ("enemyId") REFERENCES "enemy" ("enemy_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
