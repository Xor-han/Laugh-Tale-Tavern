/*
  Warnings:

  - You are about to drop the column `arcId` on the `onePieceCharacter` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "onePieceCharacter" DROP CONSTRAINT "onePieceCharacter_arcId_fkey";

-- AlterTable
ALTER TABLE "onePieceCharacter" DROP COLUMN "arcId";

-- CreateTable
CREATE TABLE "_ArcsToOnePieceCharacter" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ArcsToOnePieceCharacter_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ArcsToOnePieceCharacter_B_index" ON "_ArcsToOnePieceCharacter"("B");

-- AddForeignKey
ALTER TABLE "_ArcsToOnePieceCharacter" ADD CONSTRAINT "_ArcsToOnePieceCharacter_A_fkey" FOREIGN KEY ("A") REFERENCES "arcs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArcsToOnePieceCharacter" ADD CONSTRAINT "_ArcsToOnePieceCharacter_B_fkey" FOREIGN KEY ("B") REFERENCES "onePieceCharacter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
