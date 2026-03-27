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

export const fixOrder = mutation({
  args: {},
  handler: async (ctx) => {
    const members = await ctx.db.query("team").collect();
    for (const m of members) {
        if (m.name === "Milan Seidl") {
            console.log(`Patching Milan Seidl with order 1`);
            await ctx.db.patch(m._id, { order: 1 });
        } else if (m.name === "Miroslav Zeman") {
            console.log(`Patching Miroslav Zeman with order 2`);
            await ctx.db.patch(m._id, { order: 2 });
        } else if (m.name === "Barbora Fišerová") {
            console.log(`Patching Barbora Fišerová with order 3`);
            await ctx.db.patch(m._id, { order: 3 });
        } else if (m.name === "Jiří Zápotocký") {
            console.log(`Patching Jiří Zápotocký with order: 4`);
            await ctx.db.patch(m._id, { order: 4 });
        } else if (m.name === "Jaroslav Zápotocký") {
            console.log(`Patching Jaroslav Zápotocký with order: 5`);
            await ctx.db.patch(m._id, { order: 5 });
        } else if (m.name === "Tomáš Nyári") {
            console.log(`Patching Tomáš Nyári with order: 6`);
            await ctx.db.patch(m._id, { order: 6 });
        } else if (m.name === "Jakub Seidl") {
            console.log(`Patching Jakub Seidl with order: 7`);
            await ctx.db.patch(m._id, { order: 7 });
        } else {
            // Assign order 10 to others if they don't have one
            if (m.order === undefined) {
                console.log(`Patching ${m.name} with order: 10`);
                await ctx.db.patch(m._id, { order: 10 });
            }
        }
    }
  },
});
