/*
  Warnings:

  - You are about to drop the column `currentPrice` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `isFeatured` on the `Course` table. All the data in the column will be lost.
  - Added the required column `position` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `Section` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "currentPrice",
DROP COLUMN "isFeatured";

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "position" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Section" ADD COLUMN     "position" INTEGER NOT NULL;
