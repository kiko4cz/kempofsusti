import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getImages = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("gallery")
      .order("desc") // Order by createdAt descending (newest first)
      .collect();
  },
});

export const addImage = mutation({
  args: {
    url: v.string(),
    publicId: v.string(),
    alt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { url, publicId, alt } = args;
    await ctx.db.insert("gallery", {
      url,
      publicId,
      alt,
      createdAt: Date.now(),
    });
  },
});

export const deleteImage = mutation({
  args: {
    id: v.id("gallery"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
