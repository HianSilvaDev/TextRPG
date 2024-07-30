/*
  Warnings:

  - A unique constraint covering the columns `[text]` on the table `EventPhrase` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EventPhrase_text_key" ON "EventPhrase"("text");
