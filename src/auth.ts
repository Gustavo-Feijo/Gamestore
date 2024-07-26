import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import prisma from "./server/db";
import { PrismaAdapter } from "@auth/prisma-adapter";

// Basic setup for Auth.js.
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [GitHub],
});
