import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 403 })
    }

    const resolvedParams = await params
    const { isActive } = await req.json()

    const campaign = await prisma.campaign.update({
      where: { id: resolvedParams.id },
      data: { isActive }
    })

    return NextResponse.json({ message: "Kampanya güncellendi", campaign }, { status: 200 })
  } catch (error) {
    console.error("Kampanya güncelleme hatası:", error)
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 403 })
    }

    const resolvedParams = await params

    await prisma.campaign.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({ message: "Kampanya silindi" }, { status: 200 })
  } catch (error) {
    console.error("Kampanya silme hatası:", error)
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 })
  }
}
