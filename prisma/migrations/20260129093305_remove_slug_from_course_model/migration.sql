/*
  Warnings:

  - You are about to drop the column `slug` on the `Course` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Course_slug_key";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "slug";
