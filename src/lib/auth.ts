import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabaseAdmin } from "@/lib/supabase-server";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
    async signIn({ user }) {
      if (!user.id) return true;

      const { data: existing } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!existing) {
        await supabaseAdmin.from("profiles").insert({
          user_id: user.id,
          business_name: user.name || "",
          business_phone: "",
          business_address: "",
        });
      }

      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
};