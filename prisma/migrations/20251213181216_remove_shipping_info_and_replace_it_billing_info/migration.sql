/*
  Warnings:

  - You are about to drop the column `paymentMethod` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `shippingAddress` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "paymentMethod",
DROP COLUMN "shippingAddress",
ADD COLUMN     "billingInfo" JSON;
