import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getCamps = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("camps")
      .order("desc")
      .collect();
  },
});

export const addCamp = mutation({
  args: {
    dates: v.string(),
    location: v.string(),
    price: v.string(),
    status: v.string(),
    features: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("camps", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const updateCamp = mutation({
  args: {
    id: v.id("camps"),
    dates: v.string(),
    location: v.string(),
    price: v.string(),
    status: v.string(),
    features: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const deleteCamp = mutation({
  args: {
    id: v.id("camps"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
