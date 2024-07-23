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
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
