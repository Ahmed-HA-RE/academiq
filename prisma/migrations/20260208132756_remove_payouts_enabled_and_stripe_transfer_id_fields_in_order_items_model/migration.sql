/*
  Warnings:

  - You are about to drop the column `payoutsEnabled` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `stripeTransferId` on the `OrderItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "payoutsEnabled",
DROP COLUMN "stripeTransferId";
