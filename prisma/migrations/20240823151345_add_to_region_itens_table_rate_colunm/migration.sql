-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_regionItens" (
    "region_name" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,
    "spawnrate" REAL NOT NULL DEFAULT 10,

    PRIMARY KEY ("region_name", "itemId"),
    CONSTRAINT "regionItens_region_name_fkey" FOREIGN KEY ("region_name") REFERENCES "Region" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "regionItens_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item" ("item_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_regionItens" ("itemId", "region_name") SELECT "itemId", "region_name" FROM "regionItens";
DROP TABLE "regionItens";
ALTER TABLE "new_regionItens" RENAME TO "regionItens";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
