/*
  Warnings:

  - Added the required column `stripeAccountId` to the `IntructorApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IntructorApplication" ADD COLUMN     "stripeAccountId" TEXT NOT NULL;
