import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import bcrypt from "bcryptjs";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Password({
      crypto: {
        hashSecret: async (password: string) => bcrypt.hashSync(password, 10),
        verifySecret: async (password: string, hash: string) => bcrypt.compareSync(password, hash),
      },
    }),
  ],
});
