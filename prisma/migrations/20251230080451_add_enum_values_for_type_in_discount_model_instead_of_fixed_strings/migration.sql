/*
  Warnings:

  - Changed the type of `type` on the `Discount` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "type" AS ENUM ('percentage', 'fixed');

-- AlterTable
ALTER TABLE "Discount" DROP COLUMN "type",
ADD COLUMN     "type" "type" NOT NULL;
