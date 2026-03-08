import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { env } from "@/shared/env";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  secret: env.AUTH_SECRET,
});
