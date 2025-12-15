/*
  Warnings:

  - You are about to drop the column `paymentResults` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "paymentResult" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "paymentResults";
