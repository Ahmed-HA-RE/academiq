/*
  Warnings:

  - Added the required column `uploadthingFileId` to the `MuxData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MuxData" ADD COLUMN     "uploadthingFileId" TEXT NOT NULL;
