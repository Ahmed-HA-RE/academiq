/*
  Warnings:

  - You are about to drop the `CartItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_cartId_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_courseId_fkey";

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "cartItems" JSONB[];

-- DropTable
DROP TABLE "CartItem";
