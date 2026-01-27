/*
  Warnings:

  - Added the required column `position` to the `Section` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Section" ADD COLUMN     "position" INTEGER NOT NULL;
