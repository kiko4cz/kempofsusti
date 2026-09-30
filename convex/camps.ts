import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getCamps = query({
  args: {},
  handler: async (ctx) => {
    const camps = await ctx.db
      .query("camps")
      .order("desc")
      .collect();

    // Fetch counts for each camp
    const campsWithCounts = await Promise.all(
      camps.map(async (camp) => {
        const registrations = await ctx.db
          .query("registrations")
          .filter((q) => q.eq(q.field("campId"), camp._id))
          .collect();

        const registeredCount = registrations.length;
        const confirmedCount = registrations.filter(r => r.status === "Schválená").length;

        return {
          ...camp,
          registeredCount,
          confirmedCount,
        };
      })
    );

    return campsWithCounts;
  },
});

export const addCamp = mutation({
  args: {
    dates: v.string(),
    location: v.string(),
    price: v.string(),
    status: v.string(),
    capacity: v.optional(v.number()),
    features: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

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
    capacity: v.optional(v.number()),
    features: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const deleteCamp = mutation({
  args: {
    id: v.id("camps"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    await ctx.db.delete(args.id);
  },
});
