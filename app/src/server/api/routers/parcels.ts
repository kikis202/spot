import { db } from "~/server/db";
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { ParcelSize, ParcelStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const generateTrackingNumber = () => {
  const prefix = "SPOT";
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${randomPart}`.toUpperCase();
};

const checkIfAddressExists = async (
  id: string,
  message: string | undefined,
) => {
  const address = await db.address.findUnique({ where: { id } });
  if (!address) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: message ?? "Address not found",
    });
  }
};

export const parcelsRouter = createTRPCRouter({
  getAll: adminProcedure
    .input(
      z.object({
        size: z.number().optional().default(10),
        page: z.number().optional().default(1),
        query: z
          .object({
            trackingNumber: z.string().optional(),
            status: z.nativeEnum(ParcelStatus).optional(),
            size: z.nativeEnum(ParcelSize).optional(),
            senderId: z.string().optional(),
            courierId: z.string().optional(),
            originId: z.string().optional(),
            destinationId: z.string().optional(),
          })
          .optional()
          .default({}),
      }),
    )
    .query(async ({ input }) => {
      const parcels = await db.parcel.findMany({
        skip: input.size * (input.page - 1),
        take: input.size,
        where: input.query,
      });

      return parcels;
    }),
  create: protectedProcedure
    .input(
      z.object({
        weight: z.number(),
        size: z.nativeEnum(ParcelSize),
        notes: z.string().max(255, "Note too long").optional(),
        originId: z.string(),
        destinationId: z.string(),
        lockerId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const senderId = ctx.session.user.id;

      await checkIfAddressExists(input.originId, "Origin address not found");
      await checkIfAddressExists(
        input.destinationId,
        "Destination address not found",
      );

      const parcel = await db.parcel.create({
        data: {
          senderId,
          trackingNumber: generateTrackingNumber(),
          weight: input.weight,
          size: input.size,
          notes: input.notes,
          originId: input.originId,
          destinationId: input.destinationId,
          lockerId: input.lockerId,
        },
      });

      return parcel;
    }),
});
