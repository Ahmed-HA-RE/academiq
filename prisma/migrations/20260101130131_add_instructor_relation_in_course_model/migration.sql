/*
  Warnings:

  - Made the column `instructorId` on table `Course` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `type` on the `Discount` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Type" AS ENUM ('percentage', 'fixed');

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_instructorId_fkey";

-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "instructorId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Discount" DROP COLUMN "type",
ADD COLUMN     "type" "Type" NOT NULL;

-- DropEnum
DROP TYPE "type";

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
