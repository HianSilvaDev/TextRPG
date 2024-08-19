-- CreateTable
CREATE TABLE "regionItens" (
    "region_name" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,

    PRIMARY KEY ("region_name", "itemId"),
    CONSTRAINT "regionItens_region_name_fkey" FOREIGN KEY ("region_name") REFERENCES "Region" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "regionItens_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item" ("item_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
