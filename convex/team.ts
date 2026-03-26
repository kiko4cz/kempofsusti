import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getTeam = query({
  args: {},
  handler: async (ctx) => {
    const members = await ctx.db.query("team").collect();
    return members.sort((a, b) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return (b.createdAt ?? 0) - (a.createdAt ?? 0);
    });
  },
});

export const addMember = mutation({
  args: {
    name: v.string(),
    role: v.string(),
    bio: v.string(),
    img: v.string(),
    gender: v.string(),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("team", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const updateMember = mutation({
  args: {
    id: v.id("team"),
    name: v.string(),
    role: v.string(),
    bio: v.string(),
    img: v.string(),
    gender: v.string(),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const deleteMember = mutation({
  args: {
    id: v.id("team"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
