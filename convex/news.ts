import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getNews = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("news")
      .order("desc") // Order by createdAt descending (newest first)
      .collect();
  },
});

export const addNews = mutation({
  args: {
    title: v.string(),
    date: v.string(),
    content: v.string(),
    active: v.boolean(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    await ctx.db.insert("news", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const updateNews = mutation({
  args: {
    id: v.id("news"),
    title: v.string(),
    date: v.string(),
    content: v.string(),
    active: v.boolean(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const deleteNews = mutation({
  args: {
    id: v.id("news"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    await ctx.db.delete(args.id);
  },
});
