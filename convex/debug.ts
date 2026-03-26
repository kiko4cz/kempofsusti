import { internalQuery } from "./_generated/server";

export const listSessions = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("authSessions").collect();
  },
});

export const listIdentities = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const listAccounts = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("authAccounts").collect();
  },
});
