import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("stats")
      .order("desc") // Most recent years first
      .collect();
  },
});

export const updateYearStats = mutation({
  args: {
    year: v.number(),
    turnuses: v.array(v.object({
      id: v.string(),
      turnusId: v.number(),
      name: v.string(),
      boys: v.number(),
      girls: v.number(),
      price: v.number(),
      expenses: v.number(),
      note: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("stats")
      .filter((q) => q.eq(q.field("year"), args.year))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        turnuses: args.turnuses,
      });
    } else {
      await ctx.db.insert("stats", {
        year: args.year,
        turnuses: args.turnuses,
        createdAt: Date.now(),
      });
    }
  },
});

export const deleteYear = mutation({
  args: {
    year: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("stats")
      .filter((q) => q.eq(q.field("year"), args.year))
      .unique();
    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
