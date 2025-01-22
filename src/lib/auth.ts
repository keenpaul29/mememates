import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from 'bcryptjs';
import { NextAuthOptions, Session } from "next-auth/next";
import { JWT } from "next-auth/jwt";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  // Remove adapter when using JWT strategy with credentials provider
  // adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          return null;
        }

        // Check password
        const isValidPassword = await bcrypt.compare(
          credentials.password, 
          user.password
        );

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name
        };
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    error: '/login'
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: any }) {
      if (token) {
        session.user.id = token.id?.toString() ?? '';
        session.user.name = token.name ?? '';
        session.user.email = token.email ?? '';
        session.user.isNewUser = Boolean(token.isNewUser);
      }
      return session;
    },
    async jwt({ token, user, account, profile, trigger }: { token: JWT; user: any; account: any; profile: any; trigger: any }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      
      // Check if this is the first time the user is signing in
      if (account && profile) {
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email },
          select: { createdAt: true }
        });
        
        // If user was just created (within last minute), mark as new
        if (!existingUser || 
            (new Date().getTime() - existingUser.createdAt.getTime()) < 60000) {
          token.isNewUser = true;
        } else {
          token.isNewUser = false;
        }

        // Store provider access token if available
        if (account.access_token) {
          token.accessToken = account.access_token;
        }
      }
      
      return token;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Always redirect to discover unless explicitly set
      if (url.includes('/onboarding')) {
        return `${baseUrl}/onboarding`;
      }
      return `${baseUrl}/discover`;
    },
  }
}
