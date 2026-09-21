import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getByChild = query({
  args: { childId: v.id("children") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Verify parent is the owner, or user is coach/admin
    const user = await ctx.db.get(userId);
    const child = await ctx.db.get(args.childId);
    
    if (!child) return [];

    if (child.parentId !== userId && user?.role !== "admin" && user?.role !== "coach") {
      return [];
    }

    return await ctx.db
      .query("evaluations")
      .withIndex("by_child", (q) => q.eq("childId", args.childId))
      .collect();
  },
});

export const getByCamp = query({
  args: { campId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const user = await ctx.db.get(userId);
    if (user?.role !== "admin" && user?.role !== "coach") {
      return [];
    }

    return await ctx.db
      .query("evaluations")
      .withIndex("by_camp", (q) => q.eq("campId", args.campId))
      .collect();
  },
});

export const addEvaluation = mutation({
  args: {
    childId: v.id("children"),
    campId: v.string(),
    pointsBehavior: v.number(),
    pointsFriends: v.number(),
    pointsCompetitions: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const user = await ctx.db.get(userId);
    if (user?.role !== "admin" && user?.role !== "coach") {
      throw new Error("Only coaches and admins can evaluate");
    }

    // Check if evaluation already exists for this child in this camp
    const existing = await ctx.db
      .query("evaluations")
      .withIndex("by_child", (q) => q.eq("childId", args.childId))
      .filter((q) => q.eq(q.field("campId"), args.campId))
      .unique();

    if (existing) {
      // Update existing
      await ctx.db.patch(existing._id, {
        pointsBehavior: args.pointsBehavior,
        pointsFriends: args.pointsFriends,
        pointsCompetitions: args.pointsCompetitions,
        notes: args.notes,
        coachId: userId, // update the coach who last edited
      });
      return existing._id;
    } else {
      return await ctx.db.insert("evaluations", {
        childId: args.childId,
        campId: args.campId,
        coachId: userId,
        pointsBehavior: args.pointsBehavior,
        pointsFriends: args.pointsFriends,
        pointsCompetitions: args.pointsCompetitions,
        notes: args.notes,
        createdAt: Date.now(),
      });
    }
  },
});
