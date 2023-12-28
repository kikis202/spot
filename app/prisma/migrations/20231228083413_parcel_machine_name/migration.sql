/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ParcelMachine` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `ParcelMachine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ParcelMachine" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ParcelMachine_name_key" ON "ParcelMachine"("name");
