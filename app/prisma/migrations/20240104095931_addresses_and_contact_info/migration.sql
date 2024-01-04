/*
  Warnings:

  - Added the required column `receiverContactId` to the `Parcel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderContactId` to the `Parcel` table without a default value. This is not possible if the table is not empty.
  - Made the column `destinationId` on table `Parcel` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Parcel" DROP CONSTRAINT "Parcel_destinationId_fkey";

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "addressName" TEXT;

-- AlterTable
ALTER TABLE "Parcel" ADD COLUMN     "receiverContactId" TEXT NOT NULL,
ADD COLUMN     "senderContactId" TEXT NOT NULL,
ALTER COLUMN "destinationId" SET NOT NULL;

-- CreateTable
CREATE TABLE "ContactInfo" (
    "id" TEXT NOT NULL,
    "contactName" TEXT,
    "fullName" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "ContactInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContactInfo_userId_idx" ON "ContactInfo"("userId");

-- AddForeignKey
ALTER TABLE "ContactInfo" ADD CONSTRAINT "ContactInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parcel" ADD CONSTRAINT "Parcel_senderContactId_fkey" FOREIGN KEY ("senderContactId") REFERENCES "ContactInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parcel" ADD CONSTRAINT "Parcel_receiverContactId_fkey" FOREIGN KEY ("receiverContactId") REFERENCES "ContactInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parcel" ADD CONSTRAINT "Parcel_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
