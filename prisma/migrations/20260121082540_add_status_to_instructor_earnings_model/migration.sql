-- CreateEnum
CREATE TYPE "EarningStatus" AS ENUM ('pending', 'paid', 'cancelled');

-- AlterTable
ALTER TABLE "InstructorEarnings" ADD COLUMN     "status" "EarningStatus" NOT NULL DEFAULT 'pending';
