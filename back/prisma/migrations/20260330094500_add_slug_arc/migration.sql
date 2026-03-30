/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `arcs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `arcs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "arcs" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "arcs_slug_key" ON "arcs"("slug");
