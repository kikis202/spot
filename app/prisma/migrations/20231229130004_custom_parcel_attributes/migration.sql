-- DropIndex
DROP INDEX "Parcel_senderId_courierId_idx";

-- AlterTable
ALTER TABLE "Parcel" ADD COLUMN     "dimensions" TEXT,
ALTER COLUMN "weight" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Parcel_trackingNumber_idx" ON "Parcel"("trackingNumber");

-- CreateIndex
CREATE INDEX "Parcel_senderId_idx" ON "Parcel"("senderId");

-- CreateIndex
CREATE INDEX "Parcel_courierId_idx" ON "Parcel"("courierId");
