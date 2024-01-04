-- CreateEnum
CREATE TYPE "ParcelStatus" AS ENUM ('PENDING', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'FAILED_ATTEMPT', 'AWAITING_PICKUP', 'DELIVERED', 'CANCELLED', 'RETURNED');

-- CreateEnum
CREATE TYPE "ParcelSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'XLARGE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "LockerSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'XLARGE');

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParcelUpdate" (
    "id" TEXT NOT NULL,
    "parcelId" TEXT NOT NULL,
    "status" "ParcelStatus" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParcelUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parcel" (
    "id" TEXT NOT NULL,
    "trackingNumber" TEXT NOT NULL,
    "status" "ParcelStatus" NOT NULL DEFAULT 'PENDING',
    "weight" DOUBLE PRECISION NOT NULL,
    "size" "ParcelSize" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "senderId" TEXT NOT NULL,
    "courierId" TEXT,
    "originAddressId" TEXT NOT NULL,
    "destinationId" TEXT,
    "lockerId" TEXT,

    CONSTRAINT "Parcel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParcelMachine" (
    "id" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ParcelMachine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Locker" (
    "id" TEXT NOT NULL,
    "size" "LockerSize" NOT NULL,
    "parcelMachineId" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Locker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackedParcels" (
    "userId" TEXT NOT NULL,
    "parcelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrackedParcels_pkey" PRIMARY KEY ("userId","parcelId")
);

-- CreateIndex
CREATE INDEX "Address_userId_idx" ON "Address"("userId");

-- CreateIndex
CREATE INDEX "ParcelUpdate_parcelId_idx" ON "ParcelUpdate"("parcelId");

-- CreateIndex
CREATE UNIQUE INDEX "Parcel_trackingNumber_key" ON "Parcel"("trackingNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Parcel_lockerId_key" ON "Parcel"("lockerId");

-- CreateIndex
CREATE INDEX "Parcel_senderId_courierId_idx" ON "Parcel"("senderId", "courierId");

-- CreateIndex
CREATE UNIQUE INDEX "ParcelMachine_addressId_key" ON "ParcelMachine"("addressId");

-- CreateIndex
CREATE INDEX "Locker_parcelMachineId_idx" ON "Locker"("parcelMachineId");

-- CreateIndex
CREATE INDEX "TrackedParcels_userId_idx" ON "TrackedParcels"("userId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParcelUpdate" ADD CONSTRAINT "ParcelUpdate_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "Parcel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parcel" ADD CONSTRAINT "Parcel_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parcel" ADD CONSTRAINT "Parcel_courierId_fkey" FOREIGN KEY ("courierId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parcel" ADD CONSTRAINT "Parcel_originAddressId_fkey" FOREIGN KEY ("originAddressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parcel" ADD CONSTRAINT "Parcel_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parcel" ADD CONSTRAINT "Parcel_lockerId_fkey" FOREIGN KEY ("lockerId") REFERENCES "Locker"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParcelMachine" ADD CONSTRAINT "ParcelMachine_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Locker" ADD CONSTRAINT "Locker_parcelMachineId_fkey" FOREIGN KEY ("parcelMachineId") REFERENCES "ParcelMachine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackedParcels" ADD CONSTRAINT "TrackedParcels_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackedParcels" ADD CONSTRAINT "TrackedParcels_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "Parcel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
