-- CreateTable
CREATE TABLE "EventPhrase" (
    "region_name" TEXT NOT NULL,
    "phrase_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventType" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    CONSTRAINT "EventPhrase_region_name_fkey" FOREIGN KEY ("region_name") REFERENCES "Region" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);
