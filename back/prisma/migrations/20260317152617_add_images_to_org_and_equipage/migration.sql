/*
  Warnings:

  - You are about to drop the column `equipageId` on the `faction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "faction" DROP CONSTRAINT "faction_equipageId_fkey";

-- AlterTable
ALTER TABLE "faction" DROP COLUMN "equipageId";

-- AlterTable
ALTER TABLE "images" ADD COLUMN     "equipageId" INTEGER,
ADD COLUMN     "organisationId" INTEGER;

-- CreateTable
CREATE TABLE "_EquipagesToOrganisation" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EquipagesToOrganisation_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EquipagesToOrganisation_B_index" ON "_EquipagesToOrganisation"("B");

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "faction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_equipageId_fkey" FOREIGN KEY ("equipageId") REFERENCES "Equipages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipagesToOrganisation" ADD CONSTRAINT "_EquipagesToOrganisation_A_fkey" FOREIGN KEY ("A") REFERENCES "Equipages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipagesToOrganisation" ADD CONSTRAINT "_EquipagesToOrganisation_B_fkey" FOREIGN KEY ("B") REFERENCES "faction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
