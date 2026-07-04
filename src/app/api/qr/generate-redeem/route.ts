import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "CUSTOMER") {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 403 })
    }

    const { points } = await req.json()
    if (!points || points <= 0) {
      return NextResponse.json({ message: "Geçerli bir puan girin" }, { status: 400 })
    }

    // Check if customer has enough points
    const customer = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!customer || customer.loyaltyPoints < points) {
      return NextResponse.json({ message: "Yetersiz puan" }, { status: 400 })
    }

    // Create a new QR Token valid for 5 minutes
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

    const token = await prisma.qrToken.create({
      data: {
        type: "REDEEM",
        points,
        creatorId: session.user.id,
        expiresAt
      }
    })

    return NextResponse.json({ tokenId: token.id, expiresAt: token.expiresAt }, { status: 200 })
  } catch (error) {
    console.error("Generate Redeem QR Error:", error)
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 })
  }
}
