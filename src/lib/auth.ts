import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Telefon Numarası", type: "text", placeholder: "05..." },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) {
          throw new Error("Geçersiz giriş bilgileri")
        }

        const user = await prisma.user.findUnique({
          where: {
            phone: credentials.phone
          }
        })

        if (!user || !user.passwordHash) {
          throw new Error("Kullanıcı bulunamadı")
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash)

        if (!isPasswordValid) {
          throw new Error("Hatalı şifre")
        }

        return {
          id: user.id,
          name: user.name,
          phone: user.phone,
          role: user.role
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.phone = user.phone
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
          phone: token.phone as string
        }
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
