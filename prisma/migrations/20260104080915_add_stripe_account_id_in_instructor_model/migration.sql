/*
  Warnings:

  - Added the required column `stripeAccountId` to the `Instructor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Instructor" ADD COLUMN     "stripeAccountId" TEXT NOT NULL;
