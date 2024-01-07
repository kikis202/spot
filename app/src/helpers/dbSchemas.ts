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

export const addressSchema = z.object({
  id: z.string().optional(),
  street: z.string().min(1, "Street is required").default(""),
  city: z.string().min(1, "City is required").default(""),
  postalCode: z.string().min(1, "Postal code is required").default(""),
  country: z.string().min(1, "Country is required").default(""),
});

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
);

const contactSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().default("").optional(),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(phoneRegex, "Invalid Phone number")
    .default(""),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .default(""),
});

export const personalInfoSchema = z.object({
  sender: z.object({
    address: addressSchema,
    contact: contactSchema,
  }),
  receiver: z.object({
    address: addressSchema,
    contact: contactSchema,
  }),
});
