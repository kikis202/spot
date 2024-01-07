import { z } from "zod";
import { db } from "~/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const contactsRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const contactInfo = await db.contactInfo.findUnique({
        where: { id: input.id, userId },
      });

      return contactInfo;
    }),
  create: protectedProcedure
    .input(
      z.object({
        fullName: z.string().optional(),
        phone: z.string(),
        email: z.string(),
        contactName: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const contactInfo = await db.contactInfo.create({
        data: {
          ...input,
          ...(input.contactName && { userId }),
        },
      });

      return contactInfo;
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const contactInfo = await db.contactInfo.findUnique({
        include: {
          parcelReceivers: true,
          parcelSenders: true,
        },
        where: { id: input.id },
      });

      if (!contactInfo) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Contact not found",
        });
      }

      if (contactInfo.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unauthorized",
        });
      }

      if (
        contactInfo.parcelReceivers.length === 0 &&
        contactInfo.parcelSenders.length === 0
      ) {
        // Delete contact if it is not associated with any parcels
        return await db.contactInfo.delete({
          where: { id: input.id },
        });
      }

      return await db.contactInfo.update({
        where: { id: input.id },
        data: { userId: null },
      });
    }),
});
