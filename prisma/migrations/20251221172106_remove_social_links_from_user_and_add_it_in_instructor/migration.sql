/*
  Warnings:

  - You are about to drop the column `socialLinks` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Instructor" ADD COLUMN     "socialLinks" JSON;

-- AlterTable
ALTER TABLE "IntructorApplication" ALTER COLUMN "socialLinks" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "socialLinks";
