/*
  Warnings:

  - You are about to drop the column `muxAssetId` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `muxPlaybackId` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Lesson` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "muxAssetId",
DROP COLUMN "muxPlaybackId",
DROP COLUMN "videoUrl";

-- CreateTable
CREATE TABLE "MuxData" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "muxAssetId" TEXT NOT NULL,
    "muxPlaybackId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MuxData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MuxData_lessonId_key" ON "MuxData"("lessonId");

-- AddForeignKey
ALTER TABLE "MuxData" ADD CONSTRAINT "MuxData_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
