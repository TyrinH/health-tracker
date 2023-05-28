import { z } from "zod";

import {
  createTRPCRouter,
  // publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const entriesRouter = createTRPCRouter({
  getAllEntries: protectedProcedure
    .query(async ({ ctx }) => {
      const entries = await ctx.prisma.entries.findMany({
        where: {
          authorId: ctx.session.user.id
        },
        orderBy: {
          date: 'desc'
        }
      });
      return entries;

    }),

    createEntry: protectedProcedure
    .input(z.object({ mood: z.string(), isSick: z.boolean(), notes: z.string(), authorId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.entries.create({
        data: {
          mood: input.mood,
          isSick: input.isSick,
          notes: input.notes,
          date: new Date(),
          authorId: input.authorId,
      }});
    })
});