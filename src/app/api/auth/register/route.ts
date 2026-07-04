import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { name, phone, password, role } = await req.json()

    if (!name || !phone || !password) {
      return NextResponse.json({ message: "Eksik bilgi" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { phone }
    })

    if (existingUser) {
      return NextResponse.json({ message: "Bu telefon numarası zaten kayıtlı" }, { status: 400 })
    }

    // Security Check: Only ADMIN can create CASHIER or ADMIN accounts
    let finalRole = "CUSTOMER"
    if (role && ["CASHIER", "ADMIN"].includes(role)) {
      const session = await getServerSession(authOptions)
      if (session?.user?.role === "ADMIN") {
        finalRole = role
      }
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        passwordHash,
        role: finalRole as any,
      }
    })

    return NextResponse.json({ message: "Kayıt başarılı", user: { id: user.id, name: user.name, role: user.role } }, { status: 201 })
  } catch (error) {
    console.error("Kayıt hatası:", error)
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 })
  }
}
