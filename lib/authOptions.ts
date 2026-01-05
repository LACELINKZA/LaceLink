import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        role: { label: "Role", type: "text" },
        displayName: { label: "Display Name", type: "text" }
      },
      async authorize(credentials) {
        const email = credentials?.email;
        if (!email) return null;

        const role = credentials?.role || "customer";
        const displayName = credentials?.displayName || undefined;

        if (role === "vendor") {
          await prisma.vendor.upsert({
            where: { email },
            update: { displayName },
            create: { email, displayName }
          });
        }

        return { id: email, email, role, name: displayName };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      (session.user as any).role = token.role;
      return session;
    }
  }
};
