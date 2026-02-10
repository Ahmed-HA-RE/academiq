/*
  Warnings:

  - You are about to drop the column `billingDetails` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `discountId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `itemsPrice` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `Cart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Discount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orderItems` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `coursePrice` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_discountId_fkey";

-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_userId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_discountId_fkey";

-- DropForeignKey
ALTER TABLE "orderItems" DROP CONSTRAINT "orderItems_courseId_fkey";

-- DropForeignKey
ALTER TABLE "orderItems" DROP CONSTRAINT "orderItems_orderId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "billingDetails",
DROP COLUMN "discountId",
DROP COLUMN "itemsPrice",
ADD COLUMN     "coursePrice" DECIMAL(10,2) NOT NULL;

-- DropTable
DROP TABLE "Cart";

-- DropTable
DROP TABLE "Discount";

-- DropTable
DROP TABLE "orderItems";

-- DropEnum
DROP TYPE "Type";

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "image" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "stripeTransferId" TEXT,
    "payoutsEnabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
