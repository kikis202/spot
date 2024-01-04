/*
  Warnings:

  - You are about to drop the column `notes` on the `ParcelUpdate` table. All the data in the column will be lost.
  - Added the required column `title` to the `ParcelUpdate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ParcelUpdate" DROP COLUMN "notes",
ADD COLUMN     "title" TEXT NOT NULL;
