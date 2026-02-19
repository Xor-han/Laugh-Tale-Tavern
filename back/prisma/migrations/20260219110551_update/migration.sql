/*
  Warnings:

  - You are about to drop the column `type` on the `devilFruit` table. All the data in the column will be lost.
  - You are about to drop the column `faction` on the `onePieceCharacter` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "profession" ADD VALUE 'roi_des_pirates';
ALTER TYPE "profession" ADD VALUE 'empereur';

-- AlterTable
ALTER TABLE "devilFruit" DROP COLUMN "type",
ADD COLUMN     "typeId" INTEGER;

-- AlterTable
ALTER TABLE "onePieceCharacter" DROP COLUMN "faction",
ADD COLUMN     "arcId" INTEGER,
ADD COLUMN     "equipageId" INTEGER,
ADD COLUMN     "organisationId" INTEGER;

-- DropEnum
DROP TYPE "faction";

-- DropEnum
DROP TYPE "type";

-- CreateTable
CREATE TABLE "Arcs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "Arcs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faction" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "equipageId" INTEGER,

    CONSTRAINT "faction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Equipages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "onePieceCharacter" ADD CONSTRAINT "onePieceCharacter_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "faction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onePieceCharacter" ADD CONSTRAINT "onePieceCharacter_equipageId_fkey" FOREIGN KEY ("equipageId") REFERENCES "Equipages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onePieceCharacter" ADD CONSTRAINT "onePieceCharacter_arcId_fkey" FOREIGN KEY ("arcId") REFERENCES "Arcs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devilFruit" ADD CONSTRAINT "devilFruit_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faction" ADD CONSTRAINT "faction_equipageId_fkey" FOREIGN KEY ("equipageId") REFERENCES "Equipages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
