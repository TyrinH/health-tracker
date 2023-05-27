import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const entriesRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
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