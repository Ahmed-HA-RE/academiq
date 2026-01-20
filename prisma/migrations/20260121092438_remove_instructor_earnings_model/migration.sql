/*
  Warnings:

  - You are about to drop the `InstructorEarnings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InstructorEarnings" DROP CONSTRAINT "InstructorEarnings_instructorId_fkey";

-- DropTable
DROP TABLE "InstructorEarnings";

-- DropEnum
DROP TYPE "EarningStatus";
