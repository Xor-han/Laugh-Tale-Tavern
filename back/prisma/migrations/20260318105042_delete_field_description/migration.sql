/*
  Warnings:

  - You are about to drop the column `description` on the `Equipages` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `arcs` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `devilFruit` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `faction` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `onePieceCharacter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Equipages" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "arcs" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "devilFruit" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "faction" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "onePieceCharacter" DROP COLUMN "description";
