import { ParcelSize, ParcelStatus } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "~/server/db";
import {
  adminProcedure,
  courierProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";

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
  getMy: protectedProcedure
    .input(
      z.object({
        size: z.number().optional().default(10),
        page: z.number().optional().default(1),
        query: z
          .object({
            trackingNumber: z.string().optional(),
            status: z.nativeEnum(ParcelStatus).optional(),
            size: z.nativeEnum(ParcelSize).optional(),
            originId: z.string().optional(),
            destinationId: z.string().optional(),
          })
          .optional()
          .default({}),
      }),
    )
    .query(async ({ ctx, input }) => {
      const senderId = ctx.session.user.id;

      const parcels = await db.parcel.findMany({
        skip: input.size * (input.page - 1),
        take: input.size,
        where: { senderId, ...input.query },
      });

      return parcels;
    }),
  getAssigned: courierProcedure
    .input(
      z.object({
        size: z.number().optional().default(10),
        page: z.number().optional().default(1),
        query: z
          .object({
            trackingNumber: z.string().optional(),
            status: z.nativeEnum(ParcelStatus).optional(),
            size: z.nativeEnum(ParcelSize).optional(),
            originId: z.string().optional(),
            destinationId: z.string().optional(),
          })
          .optional()
          .default({}),
      }),
    )
    .query(async ({ ctx, input }) => {
      const courierId = ctx.session.user.id;

      const parcels = await db.parcel.findMany({
        skip: input.size * (input.page - 1),
        take: input.size,
        where: { courierId, ...input.query },
      });

      return parcels;
    }),
  // parcels from TrackedParcels model
  getTracked: protectedProcedure
    .input(
      z.object({
        size: z.number().optional().default(10),
        page: z.number().optional().default(1),
        query: z
          .object({
            trackingNumber: z.string().optional(),
            status: z.nativeEnum(ParcelStatus).optional(),
            size: z.nativeEnum(ParcelSize).optional(),
            originId: z.string().optional(),
            destinationId: z.string().optional(),
          })
          .optional()
          .default({}),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const parcels = (
        await db.trackedParcels.findMany({
          include: { parcel: true },
          skip: input.size * (input.page - 1),
          take: input.size,
          where: { userId, parcel: { ...input.query } },
        })
      ).map(({ parcel }) => parcel);

      return parcels;
    }),
  getOne: publicProcedure
    .input(z.object({ trackingNumber: z.string() }))
    .query(async ({ input }) => {
      const parcel = await db.parcel.findUnique({
        where: { trackingNumber: input.trackingNumber },
      });

      if (!parcel) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Parcel not found",
        });
      }

      return parcel;
    }),
  trackOne: protectedProcedure
    .input(z.object({ trackingNumber: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const parcel = await db.parcel.findUnique({
        where: { trackingNumber: input.trackingNumber },
      });

      if (!parcel) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Parcel not found",
        });
      }

      try {
        await db.trackedParcels.create({
          data: {
            userId,
            parcelId: parcel.id,
          },
        });
        return parcel;
      } catch (error) {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          // duplicate key error
          throw new TRPCError({
            code: "CONFLICT",
            message: "Parcel already tracked",
          });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred.",
          });
        }
      }
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
  assignMany: courierProcedure
    .input(
      z.object({
        courierId: z.string(),
        parcelIds: z.array(z.string()),
      }),
    )
    .query(async ({ input }) => {
      const { courierId, parcelIds } = input;

      const parcels = await db.parcel.findMany({
        where: { id: { in: parcelIds } },
      });

      if (parcels.length !== parcelIds.length) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Some parcels not found",
        });
      }

      const updatedParcels = await db.parcel.updateMany({
        where: { id: { in: parcelIds } },
        data: { courierId },
      });

      return updatedParcels;
    }),
  updateStatus: courierProcedure
    .input(
      z.object({
        parcelId: z.string(),
        status: z.nativeEnum(ParcelStatus),
        lockerId: z.string().optional(),
        notes: z.string().max(255, "Note too long").optional(),
      }),
    )
    .query(async ({ input }) => {
      const parcel = await db.parcel.findUnique({
        where: { id: input.parcelId },
      });

      if (!parcel) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Parcel not found",
        });
      }

      if (
        parcel.status in
        [ParcelStatus.DELIVERED, ParcelStatus.RETURNED, ParcelStatus.CANCELLED]
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Parcel is already ${parcel.status}`,
        });
      }

      const updatedParcel = await db.parcel.update({
        where: { id: input.parcelId },
        data: { status: input.status, lockerId: input.lockerId },
      });

      await db.parcelUpdate.create({
        data: {
          parcelId: input.parcelId,
          status: input.status,
          notes: input.notes,
        },
      });

      return updatedParcel;
    }),
});
