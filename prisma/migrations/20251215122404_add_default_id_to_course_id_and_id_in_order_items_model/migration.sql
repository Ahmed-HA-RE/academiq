-- DropForeignKey
ALTER TABLE "orderItems" DROP CONSTRAINT "orderItems_orderId_fkey";

-- AddForeignKey
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
