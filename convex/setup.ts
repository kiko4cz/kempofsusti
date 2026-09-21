import { mutation } from "./_generated/server";

export const makeAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const adminUser = users.find(u => u.email === "admin@kempofsusti.cz");
    
    if (adminUser) {
      await ctx.db.patch(adminUser._id, { role: "admin" });
      return `Set role 'admin' for user ${adminUser.email}`;
    }
    
    return "Admin user not found in the database. Please sign up first.";
  },
});
