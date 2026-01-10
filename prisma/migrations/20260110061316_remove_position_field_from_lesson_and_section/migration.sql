/*
  Warnings:

  - You are about to drop the column `position` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Section` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "position";

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "position";
