import { ParcelSize } from "@prisma/client";
import { z } from "zod";

export const parcelCreateInputSchema = z.object({
  weight: z.number().optional(),
  dimensions: z.string().optional(),
  size: z.nativeEnum(ParcelSize),
  notes: z.string().max(255, "Note too long").optional(),
  originId: z.string(),
  destinationId: z.string(),
  senderContactId: z.string(),
  receiverContactId: z.string(),
  lockerId: z.string().optional(),
});
