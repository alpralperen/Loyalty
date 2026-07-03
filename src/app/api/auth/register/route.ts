import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

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

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        passwordHash,
        // Allow creating other roles if specified (for testing purposes, in production this should be secured)
        role: role && ["CUSTOMER", "CASHIER", "ADMIN"].includes(role) ? role : "CUSTOMER",
      }
    })

    return NextResponse.json({ message: "Kayıt başarılı", user: { id: user.id, name: user.name, role: user.role } }, { status: 201 })
  } catch (error) {
    console.error("Kayıt hatası:", error)
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 })
  }
}
