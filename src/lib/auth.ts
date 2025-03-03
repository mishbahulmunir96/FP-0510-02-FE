import axios from "axios";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { axiosInstance } from "./axios";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      async authorize(user) {
        if (user) {
          return user;
        }
        return null;
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
  callbacks: {
    async signIn({ account, user }: any) {
      if (account?.provider === "google") {
        try {
          const accessToken = account?.access_token;

          // Panggil API backend untuk login dengan google
          const { data } = await axiosInstance.post("/auth/login/google", {
            accessToken,
          });

          // Set properti user berdasarkan response backend
          user.id = data.data.id;
          user.name = data.data.name;
          user.role = data.data.role;
          user.provider = data.data.provider;
          user.token = data.token;
          user.email = data.data.email;
          user.imageUrl = data.data.imageUrl;

          // Pastikan struktur data konsisten
          // Jika isVerified ada di data.data, bukan data.data.user
          user.isVerified = data.data.isVerified || true;

          return true;
        } catch (error) {
          console.error("Error pada autentikasi Google:", error);
          return false; // Mengembalikan false akan menyebabkan error autentikasi
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
  },
});
