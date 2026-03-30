/*
  Warnings:

  - You are about to drop the column `equipageId` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `equipageId` on the `images` table. All the data in the column will be lost.
  - You are about to drop the column `devilFruit_id` on the `onePieceCharacter` table. All the data in the column will be lost.
  - You are about to drop the column `equipageId` on the `onePieceCharacter` table. All the data in the column will be lost.
  - You are about to drop the `Equipages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EquipagesToOrganisation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `faction` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `devilFruit` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `onePieceCharacter` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `devilFruit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `onePieceCharacter` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_EquipagesToOrganisation" DROP CONSTRAINT "_EquipagesToOrganisation_A_fkey";

-- DropForeignKey
ALTER TABLE "_EquipagesToOrganisation" DROP CONSTRAINT "_EquipagesToOrganisation_B_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_equipageId_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_organisationId_fkey";

-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_equipageId_fkey";

-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_organisationId_fkey";

-- DropForeignKey
ALTER TABLE "onePieceCharacter" DROP CONSTRAINT "onePieceCharacter_devilFruit_id_fkey";

-- DropForeignKey
ALTER TABLE "onePieceCharacter" DROP CONSTRAINT "onePieceCharacter_equipageId_fkey";

-- DropForeignKey
ALTER TABLE "onePieceCharacter" DROP CONSTRAINT "onePieceCharacter_organisationId_fkey";

-- AlterTable
ALTER TABLE "comment" DROP COLUMN "equipageId",
ADD COLUMN     "crewId" INTEGER;

-- AlterTable
ALTER TABLE "devilFruit" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "images" DROP COLUMN "equipageId",
ADD COLUMN     "crewId" INTEGER;

-- AlterTable
ALTER TABLE "onePieceCharacter" DROP COLUMN "devilFruit_id",
DROP COLUMN "equipageId",
ADD COLUMN     "crewId" INTEGER,
ADD COLUMN     "devilFruitId" INTEGER,
ADD COLUMN     "slug" TEXT NOT NULL;

-- DropTable
DROP TABLE "Equipages";

-- DropTable
DROP TABLE "_EquipagesToOrganisation";

-- DropTable
DROP TABLE "faction";

-- CreateTable
CREATE TABLE "organisation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "organisation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crew" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "crew_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CrewsToOrganisation" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CrewsToOrganisation_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "organisation_slug_key" ON "organisation"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "crew_slug_key" ON "crew"("slug");

-- CreateIndex
CREATE INDEX "_CrewsToOrganisation_B_index" ON "_CrewsToOrganisation"("B");

-- CreateIndex
CREATE UNIQUE INDEX "devilFruit_slug_key" ON "devilFruit"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "onePieceCharacter_slug_key" ON "onePieceCharacter"("slug");

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "crew"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onePieceCharacter" ADD CONSTRAINT "onePieceCharacter_devilFruitId_fkey" FOREIGN KEY ("devilFruitId") REFERENCES "devilFruit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onePieceCharacter" ADD CONSTRAINT "onePieceCharacter_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onePieceCharacter" ADD CONSTRAINT "onePieceCharacter_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "crew"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "crew"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CrewsToOrganisation" ADD CONSTRAINT "_CrewsToOrganisation_A_fkey" FOREIGN KEY ("A") REFERENCES "crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CrewsToOrganisation" ADD CONSTRAINT "_CrewsToOrganisation_B_fkey" FOREIGN KEY ("B") REFERENCES "organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
