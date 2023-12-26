/*
  Warnings:

  - You are about to drop the column `originAddressId` on the `Parcel` table. All the data in the column will be lost.
  - You are about to drop the column `available` on the `ParcelMachine` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Locker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originId` to the `Parcel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Parcel" DROP CONSTRAINT "Parcel_originAddressId_fkey";

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Locker" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Parcel" DROP COLUMN "originAddressId",
ADD COLUMN     "originId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ParcelMachine" DROP COLUMN "available",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Parcel" ADD CONSTRAINT "Parcel_originId_fkey" FOREIGN KEY ("originId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
