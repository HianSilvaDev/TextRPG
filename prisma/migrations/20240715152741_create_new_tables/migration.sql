-- CreateTable
CREATE TABLE "skill" (
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

-- CreateTable
CREATE TABLE "item" (
    "item_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "url_img" TEXT NOT NULL,
    "effect" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "class" TEXT NOT NULL,
    "atb" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Player" (
    "userId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "hp" INTEGER NOT NULL,
    "mp" INTEGER NOT NULL,
    "strength" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL,
    "dexterity" INTEGER NOT NULL,
    "resistance" INTEGER NOT NULL,
    "intelligence" INTEGER NOT NULL,
    "luck" INTEGER NOT NULL,
    "wallet" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "Player_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlayerSkill" (
    "playerId" INTEGER NOT NULL,
    "skillId" INTEGER NOT NULL,

    PRIMARY KEY ("playerId", "skillId"),
    CONSTRAINT "PlayerSkill_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlayerSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skill" ("id_skill") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlayerItens" (
    "playerId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,

    PRIMARY KEY ("playerId", "itemId"),
    CONSTRAINT "PlayerItens_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlayerItens_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item" ("item_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "skill_name_key" ON "skill"("name");

-- CreateIndex
CREATE UNIQUE INDEX "item_name_key" ON "item"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Player_name_key" ON "Player"("name");
