
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import bcrypt from "bcryptjs";

export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") {
      return []; // Only admins can see all users
    }
    
    return await ctx.db.query("users").collect();
  },
});

export const getCoaches = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") {
      return []; 
    }
    
    const allUsers = await ctx.db.query("users").collect();
    return allUsers.filter(u => u.role === "coach");
  },
});

export const updateRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("coach"), v.literal("parent")),
  },
  handler: async (ctx, args) => {
    const adminId = await getAuthUserId(ctx);
    if (!adminId) throw new Error("Unauthorized");
    
    const admin = await ctx.db.get(adminId);
    if (admin?.role !== "admin") {
      throw new Error("Only admins can update roles");
    }
    
    await ctx.db.patch(args.userId, { role: args.role });
  }
});

export const changePassword = mutation({
  args: {
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const account = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) =>
        q.eq("userId", userId).eq("provider", "password")
      )
      .unique();

    if (!account) {
      throw new Error("Password account not found");
    }

    const secret = bcrypt.hashSync(args.newPassword, 10);
    await ctx.db.patch(account._id, { secret });
    
    return { success: true };
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(userId, {
      name: args.name,
      phone: args.phone,
    });
    
    return { success: true };
  }
});
