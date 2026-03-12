/*
  Warnings:

  - You are about to drop the column `Image` on the `devilFruit` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `onePieceCharacter` table. All the data in the column will be lost.
  - You are about to drop the `Arcs` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[imageId]` on the table `devilFruit` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[imageId]` on the table `onePieceCharacter` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "onePieceCharacter" DROP CONSTRAINT "onePieceCharacter_arcId_fkey";

-- AlterTable
ALTER TABLE "devilFruit" DROP COLUMN "Image",
ADD COLUMN     "imageId" TEXT;

-- AlterTable
ALTER TABLE "onePieceCharacter" DROP COLUMN "image",
ADD COLUMN     "imageId" TEXT;

-- DropTable
DROP TABLE "Arcs";

-- CreateTable
CREATE TABLE "arcs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imageId" TEXT,

    CONSTRAINT "arcs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "arcs_imageId_key" ON "arcs"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "image_publicId_key" ON "image"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "devilFruit_imageId_key" ON "devilFruit"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "onePieceCharacter_imageId_key" ON "onePieceCharacter"("imageId");

-- AddForeignKey
ALTER TABLE "arcs" ADD CONSTRAINT "arcs_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onePieceCharacter" ADD CONSTRAINT "onePieceCharacter_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onePieceCharacter" ADD CONSTRAINT "onePieceCharacter_arcId_fkey" FOREIGN KEY ("arcId") REFERENCES "arcs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devilFruit" ADD CONSTRAINT "devilFruit_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
