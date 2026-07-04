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

    const { pointsRequired, storeName } = await req.json()

    const setting = await prisma.setting.upsert({
      where: { id: "default" },
      update: {
        pointsRequired: Number(pointsRequired),
        storeName
      },
      create: {
        id: "default",
        pointsRequired: Number(pointsRequired),
        storeName
      }
    })

    return NextResponse.json({ message: "Ayarlar güncellendi", setting }, { status: 200 })
  } catch (error) {
    console.error("Ayar güncelleme hatası:", error)
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 })
  }
}
