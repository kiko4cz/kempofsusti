import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";

export const submitRegistration = mutation({
  args: {
    childId: v.optional(v.id("children")),
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
    const { childId, ...restArgs } = args;
    
    // Securely get the user ID from the authentication context
    const userId = await getAuthUserId(ctx) ?? undefined;
    
    let finalChildId = childId;

    // Pokud uživatel je přihlášen, ale nevybral existující dítě, vytvoříme mu ho automaticky
    if (userId && !finalChildId) {
      finalChildId = await ctx.db.insert("children", {
        parentId: userId,
        name: restArgs.childName,
        birthDate: restArgs.childBirthDate,
        club: restArgs.childClub,
        tshirtSize: restArgs.tshirtSize,
        healthInfo: restArgs.healthInfo,
        notes: restArgs.notes,
        createdAt: Date.now(),
      });
    }

    const registrationId = await ctx.db.insert("registrations", {
      userId,
      childId: finalChildId,
      ...restArgs,
      status: "Nová",
      createdAt: Date.now(),
    });

    // Odeslat e-mail rodiči o přijetí přihlášky (pokud má nastaveno SMTP)
    await ctx.scheduler.runAfter(0, internal.emails.sendStatusEmail, {
      email: restArgs.parentEmail,
      parentName: restArgs.parentName,
      childName: restArgs.childName,
      campName: restArgs.campName,
      campDates: restArgs.campDates,
      status: "Přijatá",
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

export const getMyRegistrations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("registrations")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
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
    
    let registrations = await ctx.db
      .query("registrations")
      .filter((q) => q.eq(q.field("campId"), args.campId))
      .collect();

    // Pokud je to pouze trenér, vidí jen děti, které mu byly přiděleny
    if (user.role === "coach") {
      registrations = registrations.filter(r => r.assignedCoachId === userId);
    }
    
    return registrations;
  }
});

export const assignCoach = mutation({
  args: {
    registrationId: v.id("registrations"),
    coachId: v.optional(v.id("users")), // Pokud je undefined/null, trenér se odebere
  },
  handler: async (ctx, args) => {
    const adminId = await getAuthUserId(ctx);
    if (!adminId) throw new Error("Unauthorized");
    
    const admin = await ctx.db.get(adminId);
    if (admin?.role !== "admin") {
      throw new Error("Only admins can assign coaches");
    }
    
    await ctx.db.patch(args.registrationId, { assignedCoachId: args.coachId });
  }
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
