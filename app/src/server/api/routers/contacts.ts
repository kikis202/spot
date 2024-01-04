import { z } from "zod";
import { db } from "~/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";

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
});
