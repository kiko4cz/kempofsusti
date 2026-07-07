import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

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
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

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
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const image = await ctx.db.get(args.id);
    if (!image) throw new Error("Image not found");

    if (image.publicId && !image.publicId.includes('local-seed') && !image.publicId.includes('manual-url') && !image.publicId.includes('/')) {
        try {
            await ctx.storage.delete(image.publicId as any);
        } catch (e) {
            console.error("Failed to delete from storage", e);
        }
    }

    await ctx.db.delete(args.id);
  },
});

export const seedGallery = mutation({
  args: {},
  handler: async (ctx) => {
    const defaultImages = [
      { url: '/galerie/IMG_0415.jpg', alt: 'Momentka z kempu' },
      { url: '/galerie/IMG_0426.jpg', alt: 'Momentka z kempu' },
      { url: '/galerie/IMG_0436.jpg', alt: 'Momentka z kempu' },
      { url: '/galerie/IMG_0438.jpg', alt: 'Momentka z kempu' },
      { url: '/galerie/IMG_5612.jpg', alt: 'Momentka z kempu' },
      { url: '/galerie/f0928466-ca1b-4100-8310-93c50c93b1de.jpg', alt: 'Momentka z kempu' },
      { url: '/galerie/771f082a-d782-47f9-8fdf-bef6287be644.jpg', alt: 'Momentka z kempu' },
      { url: '/galerie/IMG_0046.jpg', alt: 'Momentka z kempu' },
      { url: '/galerie/IMG_0057.jpg', alt: 'Momentka z kempu' },
      { url: '/galerie/IMG_0252.jpg', alt: 'Momentka z kempu' },
      { url: '/galerie/IMG_0279.jpg', alt: 'Momentka z kempu' },
      { url: '/galerie/IMG_0297.jpg', alt: 'Momentka z kempu' },
    ];
    
    // Only seed if empty
    const existing = await ctx.db.query("gallery").collect();
    if (existing.length === 0) {
      for (const img of defaultImages) {
        await ctx.db.insert("gallery", {
          url: img.url,
          publicId: 'local-seed',
          alt: img.alt,
          createdAt: Date.now(),
        });
      }
    }
  },
});
