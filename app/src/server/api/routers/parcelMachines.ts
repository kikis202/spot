import { z } from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";
import { db } from "~/server/db";
import { TRPCError } from "@trpc/server";

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
  // get: publicProcedure
  //   .input(z.object({ id: z.string() }))
  //   .query(async ({ input }) => {
  //     const address = await db.address.findUnique({
  //       where: { id: input.id },
  //     });

  //     return address;
  //   }),
  // create: protectedProcedure
  //   .input(
  //     z.object({
  //       street: z.string(),
  //       city: z.string(),
  //       postalCode: z.string(),
  //       country: z.string(),
  //       userId: z.string(),
  //     }),
  //   )
  //   .query(async ({ ctx, input }) => {
  //     const userId = ctx.session.user.id;

  //     const address = await db.address.create({
  //       data: {
  //         ...input,
  //         userId,
  //       },
  //     });

  //     return address;
  //   }),
  // update: protectedProcedure
  //   .input(
  //     z.object({
  //       id: z.string(),
  //       street: z.string(),
  //       city: z.string(),
  //       postalCode: z.string(),
  //       country: z.string(),
  //     }),
  //   )
  //   .query(async ({ ctx, input }) => {
  //     const address = await db.address.findUnique({
  //       include: {
  //         parcelDestinations: true,
  //         parcelOrigins: true,
  //         parcelMachine: true,
  //       },
  //       where: { id: input.id },
  //     });

  //     if (!address) {
  //       throw new TRPCError({
  //         code: "INTERNAL_SERVER_ERROR",
  //         message: "Address not found",
  //       });
  //     }

  //     if (address.userId !== ctx.session.user.id) {
  //       throw new TRPCError({
  //         code: "INTERNAL_SERVER_ERROR",
  //         message: "Unauthorized",
  //       });
  //     }

  //     if (
  //       address.parcelDestinations.length > 0 ||
  //       address.parcelOrigins.length > 0 ||
  //       address.parcelMachine
  //     ) {
  //       throw new TRPCError({
  //         code: "INTERNAL_SERVER_ERROR",
  //         message:
  //           "Address cannot be updated because it is associated with parcels",
  //       });
  //     }

  //     const updatedAddress = await db.address.update({
  //       where: { id: input.id },
  //       data: {
  //         street: input.street,
  //         city: input.city,
  //         postalCode: input.postalCode,
  //         country: input.country,
  //       },
  //     });

  //     return updatedAddress;
  //   }),
  // remove: protectedProcedure
  //   .input(z.object({ id: z.string() }))
  //   .query(async ({ ctx, input }) => {
  //     const address = await db.address.findUnique({
  //       include: {
  //         parcelDestinations: true,
  //         parcelOrigins: true,
  //         parcelMachine: true,
  //       },
  //       where: { id: input.id },
  //     });

  //     if (!address) {
  //       throw new TRPCError({
  //         code: "INTERNAL_SERVER_ERROR",
  //         message: "Address not found",
  //       });
  //     }

  //     if (address.userId !== ctx.session.user.id) {
  //       throw new TRPCError({
  //         code: "INTERNAL_SERVER_ERROR",
  //         message: "Unauthorized",
  //       });
  //     }

  //     if (
  //       address.parcelDestinations.length === 0 &&
  //       address.parcelOrigins.length > 0 &&
  //       !address.parcelMachine
  //     ) {
  //       // Delete address if it is not associated with any parcels
  //       return await db.address.delete({
  //         where: { id: input.id },
  //       });
  //     }

  //     return await db.address.update({
  //       where: { id: input.id },
  //       data: { userId: null },
  //     });
  //   }),
});
