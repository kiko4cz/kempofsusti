import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getContent = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("content").collect();
  },
});

export const updateContent = mutation({
  args: {
    sectionId: v.string(),
    fields: v.array(v.object({
      key: v.string(),
      value: v.union(v.string(), v.number()),
      label: v.string(),
      type: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    await updateInternal(ctx, args);
  },
});

export const internalUpdateContent = internalMutation({
  args: {
    sectionId: v.string(),
    fields: v.array(v.object({
      key: v.string(),
      value: v.union(v.string(), v.number()),
      label: v.string(),
      type: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    await updateInternal(ctx, args);
  },
});

async function updateInternal(ctx: any, args: any) {
  const existing = await ctx.db
    .query("content")
    .withIndex("by_section", (q: any) => q.eq("sectionId", args.sectionId))
    .unique();

  if (existing) {
    await ctx.db.patch(existing._id, { fields: args.fields });
  } else {
    await ctx.db.insert("content", {
      sectionId: args.sectionId,
      fields: args.fields,
    });
  }
}

export const fixHeroBg = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("content")
      .withIndex("by_section", (q: any) => q.eq("sectionId", "hero"))
      .unique();
    if (existing) {
      const newFields = existing.fields.map((f: any) => 
        f.key === "bg_image" ? { ...f, value: "/photo_2026.jpg" } : f
      );
      await ctx.db.patch(existing._id, { fields: newFields });
    }
  }
});
