/*
  Warnings:

  - You are about to drop the column `email` on the `IntructorApplication` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `IntructorApplication` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "IntructorApplication_email_key";

-- AlterTable
ALTER TABLE "IntructorApplication" DROP COLUMN "email",
DROP COLUMN "name";
