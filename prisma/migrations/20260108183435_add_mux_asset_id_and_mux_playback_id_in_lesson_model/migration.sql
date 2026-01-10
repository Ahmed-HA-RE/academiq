/*
  Warnings:

  - Added the required column `muxAssetId` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `muxPlaybackId` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "muxAssetId" TEXT NOT NULL,
ADD COLUMN     "muxPlaybackId" TEXT NOT NULL;
