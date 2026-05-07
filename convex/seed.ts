import { internalMutation } from "./_generated/server";
import bcrypt from "bcryptjs";

export const resetAdmin = internalMutation({
  args: {},
  handler: async (ctx) => {
    // List of all auth-related tables in this version of @convex-dev/auth
    const tables = [
      "users",
      "authAccounts",
      "authSessions",
      "authRefreshTokens",
      "authVerificationCodes",
      "authVerifiers",
      "authRateLimits"
    ] as const;

    console.log("Cleaning up auth tables...");
    for (const table of tables) {
      try {
        const docs = await ctx.db.query(table as any).collect();
        for (const doc of docs) {
          await ctx.db.delete(doc._id);
        }
      } catch (e) {
        console.log(`Table ${table} might not exist or encountered an error, skipping.`);
      }
    }

    console.log("Creating fresh admin user...");
    const userId = await ctx.db.insert("users", {
      email: "admin@kempofsusti.cz",
      name: "Admin",
    });

    await ctx.db.insert("authAccounts", {
      userId,
      provider: "password",
      providerAccountId: "admin@kempofsusti.cz",
      secret: bcrypt.hashSync("KempOfsUsti_2026_SecureAdmin_#42!", 10),
    });

    console.log("Admin user created: admin@kempofsusti.cz / KempOfsUsti_2026_SecureAdmin_#42!");
    return { success: true };
  },
});
