import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 403 })
    }

    const { title, description } = await req.json()

    if (!title || !description) {
      return NextResponse.json({ message: "Eksik bilgi" }, { status: 400 })
    }

    const campaign = await prisma.campaign.create({
      data: {
        title,
        description,
        isActive: true
      }
    })

    return NextResponse.json({ message: "Kampanya oluşturuldu", campaign }, { status: 201 })
  } catch (error) {
    console.error("Kampanya oluşturma hatası:", error)
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 })
  }
}
