import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getSponsors = query({
  args: {},
  handler: async (ctx) => {
    const sponsors = await ctx.db.query("sponsors").collect();
    return sponsors.sort((a, b) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return (b.createdAt ?? 0) - (a.createdAt ?? 0);
    });
  },
});

export const addSponsor = mutation({
  args: {
    name: v.string(),
    logo: v.string(),
    level: v.string(),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    await ctx.db.insert("sponsors", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const updateSponsor = mutation({
  args: {
    id: v.id("sponsors"),
    name: v.string(),
    logo: v.string(),
    level: v.string(),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const deleteSponsor = mutation({
  args: {
    id: v.id("sponsors"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const sponsor = await ctx.db.get(args.id);
    if (!sponsor) throw new Error("Sponsor not found");

    // Extract storage ID from the logo URL if it is a Convex storage URL
    if (sponsor.logo && sponsor.logo.includes('.convex.cloud/api/storage/')) {
        try {
            const storageId = sponsor.logo.split('/api/storage/')[1];
            if (storageId) {
                await ctx.storage.delete(storageId as any);
            }
        } catch (e) {
            console.error("Failed to delete from storage", e);
        }
    }

    await ctx.db.delete(args.id);
  },
});

export const seedSponsors = mutation({
  args: {},
  handler: async (ctx) => {
    const defaultSponsors = [
      { name: 'Panini', logo: '/panini_sponzor.jpeg', level: 'main', order: 1 },
    ];
    
    // Only seed if empty
    const existing = await ctx.db.query("sponsors").collect();
    if (existing.length === 0) {
      for (const sponsor of defaultSponsors) {
        await ctx.db.insert("sponsors", {
          name: sponsor.name,
          logo: sponsor.logo,
          level: sponsor.level,
          order: sponsor.order,
          createdAt: Date.now(),
        });
      }
    }
  },
});
