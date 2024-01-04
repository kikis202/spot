import { ParcelSize, ParcelStatus } from "@prisma/client";

export const ParcelStatusUI: { [key in ParcelStatus]: string } = {
  [ParcelStatus.PENDING]: "Pending",
  [ParcelStatus.IN_TRANSIT]: "In Transit",
  [ParcelStatus.OUT_FOR_DELIVERY]: "Out for Delivery",
  [ParcelStatus.FAILED_ATTEMPT]: "Failed Attempt",
  [ParcelStatus.AWAITING_PICKUP]: "Awaiting Pickup",
  [ParcelStatus.DELIVERED]: "Delivered",
  [ParcelStatus.CANCELLED]: "Cancelled",
  [ParcelStatus.RETURNED]: "Returned",
};

export const ParcelSizeUI: { [key in ParcelSize]: string } = {
  [ParcelSize.SMALL]: "Small",
  [ParcelSize.MEDIUM]: "Medium",
  [ParcelSize.LARGE]: "Large",
  [ParcelSize.XLARGE]: "X-Large",
  [ParcelSize.CUSTOM]: "Custom",
};