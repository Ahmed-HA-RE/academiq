/*
  Warnings:

  - You are about to drop the column `sessionId` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `stripePaymentIntentId` on the `Cart` table. All the data in the column will be lost.
  - Added the required column `stripePaymentIntentId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Cart_sessionId_key";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "sessionId",
DROP COLUMN "stripePaymentIntentId";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "stripePaymentIntentId" TEXT NOT NULL,
ALTER COLUMN "billingDetails" DROP NOT NULL;
