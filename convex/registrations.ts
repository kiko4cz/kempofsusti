import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

export const submitRegistration = mutation({
  args: {
    campId: v.string(),
    campName: v.string(),
    campDates: v.string(),
    parentName: v.string(),
    parentEmail: v.string(),
    parentPhone: v.string(),
    childName: v.string(),
    childBirthDate: v.string(),
    childClub: v.optional(v.string()),
    tshirtSize: v.optional(v.string()),
    healthInfo: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const registrationId = await ctx.db.insert("registrations", {
      ...args,
      status: "Nová",
      createdAt: Date.now(),
    });
    return registrationId;
  },
});

export const getRegistrations = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("registrations").order("desc").collect();
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("registrations"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const deleteRegistration = mutation({
  args: {
    id: v.id("registrations"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const triggerEmail = mutation({
  args: {
    id: v.id("registrations"),
  },
  handler: async (ctx, args) => {
    const reg = await ctx.db.get(args.id);
    
    if (reg && (reg.status === "Schválená" || reg.status === "Zamítnutá")) {
      await ctx.scheduler.runAfter(0, internal.emails.sendStatusEmail, {
        email: reg.parentEmail,
        parentName: reg.parentName,
        childName: reg.childName,
        campName: reg.campName,
        campDates: reg.campDates,
        status: reg.status,
      });
    }
  },
});
