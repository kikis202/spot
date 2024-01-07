import { LockerSize } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "~/server/db";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";

export const parcelMachinesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    const parcelMachines = await db.parcelMachine.findMany({
      select: {
        name: true,
        address: {
          select: {
            id: true,
            street: true,
            city: true,
            postalCode: true,
            country: true,
          },
        },
      },
    });

    return parcelMachines;
  }),
  getAdminAll: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        size: z.number().default(10),
      }),
    )
    .query(async ({ input }) => {
      const { page, size } = input;

      const parcelMachines = await db.parcelMachine.findMany({
        select: {
          id: true,
          name: true,
          address: {
            select: {
              id: true,
              street: true,
              city: true,
              postalCode: true,
              country: true,
            },
          },
          lockers: {
            select: {
              id: true,
              size: true,
            },
          },
        },

        skip: (page - 1) * size,
        take: size,

        orderBy: { name: "asc" },
      });

      const count = await db.parcelMachine.count();

      return { parcelMachines, count };
    }),
  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
        address: z.object({
          street: z.string(),
          city: z.string(),
          postalCode: z.string(),
          country: z.string(),
        }),
        [LockerSize.SMALL]: z.number().min(0).max(100),
        [LockerSize.MEDIUM]: z.number().min(0).max(100),
        [LockerSize.LARGE]: z.number().min(0).max(100),
        [LockerSize.XLARGE]: z.number().min(0).max(100),
      }),
    )
    .mutation(async ({ input }) => {
      const { name, address, ...lockers } = input;

      const createdAddress = await db.address.create({
        data: {
          street: address.street,
          city: address.city,
          postalCode: address.postalCode,
          country: address.country,
        },
      });

      const createdParcelMachine = await db.parcelMachine.create({
        data: {
          name,
          addressId: createdAddress.id,
        },
      });

      for (const [size, count] of Object.entries(lockers)) {
        console.log(size, count);
        await db.locker.createMany({
          data: Array.from({ length: count }, () => ({
            size: size as LockerSize,
            parcelMachineId: createdParcelMachine.id,
          })),
        });
      }

      return createdParcelMachine;
    }),
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        street: z.string(),
        city: z.string(),
        postalCode: z.string(),
        country: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const address = await db.address.findUnique({
        include: {
          parcelDestinations: true,
          parcelOrigins: true,
          parcelMachine: true,
        },
        where: { id: input.id },
      });

      if (!address) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Address not found",
        });
      }

      if (address.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unauthorized",
        });
      }

      if (
        address.parcelDestinations.length > 0 ||
        address.parcelOrigins.length > 0 ||
        address.parcelMachine
      ) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Address cannot be updated because it is associated with parcels",
        });
      }

      const updatedAddress = await db.address.update({
        where: { id: input.id },
        data: {
          street: input.street,
          city: input.city,
          postalCode: input.postalCode,
          country: input.country,
        },
      });

      return updatedAddress;
    }),
});
