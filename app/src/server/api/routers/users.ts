import { z } from "zod";
import { db } from "~/server/db";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const usersRouter = createTRPCRouter({
  getAll: adminProcedure
    .input(
      z.object({
        page: z.number().optional().default(1),
        size: z.number().optional().default(10),
        query: z
          .object({
            email: z.string().optional(),
            role: z.nativeEnum(Role).optional(),
          })
          .optional()
          .default({}),
      }),
    )
    .query(async ({ input }) => {
      const { page, size } = input;

      const query = {
        ...input.query,
        ...(input.query.email && { email: { contains: input.query.email } }),
      };

      const users = await db.user.findMany({
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
        },
        skip: (page - 1) * size,
        take: size,
        where: query,
        orderBy: {
          createdAt: "desc",
        },
      });

      const count = await db.user.count({ where: query });

      return { users, count };
    }),
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        role: z.nativeEnum(Role),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      if (userId === input.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot change your own role",
        });
      }

      const user = await db.user.update({
        where: { id: input.id },
        data: { role: input.role },
      });

      return user;
    }),
});
