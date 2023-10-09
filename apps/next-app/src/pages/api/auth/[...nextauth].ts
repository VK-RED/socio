import NextAuth, { SessionStrategy } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "db"

export const prisma = new PrismaClient();
 
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.NEXTAUTH_GOOGLE_ID as string,
      clientSecret: process.env.NEXTAUTH_GOOGLE_SECRET as string,
    }),
    
  ],

  secret : process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  }

}
export default NextAuth(authOptions)