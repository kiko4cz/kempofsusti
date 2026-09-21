import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getMyChildren = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("children")
      .withIndex("by_parent", (q) => q.eq("parentId", userId))
      .collect();
  },
});

export const getChildById = query({
  args: { id: v.id("children") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const child = await ctx.db.get(args.id);
    if (!child || child.parentId !== userId) {
      // Allow admins or coaches to see children
      const user = await ctx.db.get(userId);
      if (user?.role !== "admin" && user?.role !== "coach") {
         return null;
      }
    }
    return child;
  },
});

export const addChild = mutation({
  args: {
    name: v.string(),
    birthDate: v.string(),
    club: v.optional(v.string()),
    healthInfo: v.optional(v.string()),
    tshirtSize: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.insert("children", {
      parentId: userId,
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const updateChild = mutation({
  args: {
    id: v.id("children"),
    name: v.optional(v.string()),
    birthDate: v.optional(v.string()),
    club: v.optional(v.string()),
    healthInfo: v.optional(v.string()),
    tshirtSize: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const child = await ctx.db.get(args.id);
    if (!child) throw new Error("Child not found");

    if (child.parentId !== userId) {
      throw new Error("Unauthorized");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const deleteChild = mutation({
  args: { id: v.id("children") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const child = await ctx.db.get(args.id);
    if (!child) throw new Error("Child not found");

    if (child.parentId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
  },
});
