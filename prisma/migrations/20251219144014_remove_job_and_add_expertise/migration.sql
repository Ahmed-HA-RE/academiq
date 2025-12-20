/*
  Warnings:

  - You are about to drop the column `job` on the `IntructorApplication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "IntructorApplication" DROP COLUMN "job",
ADD COLUMN     "expertise" TEXT[];
