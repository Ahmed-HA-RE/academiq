/*
  Warnings:

  - Added the required column `currentPrice` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "currentPrice" DECIMAL(10,2) NOT NULL;
