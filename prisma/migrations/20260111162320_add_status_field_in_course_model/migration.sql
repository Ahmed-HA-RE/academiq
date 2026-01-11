-- CreateEnum
CREATE TYPE "status" AS ENUM ('processing', 'ready', 'failed');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "status" "status" NOT NULL DEFAULT 'processing';
