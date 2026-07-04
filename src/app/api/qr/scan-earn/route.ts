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

    const { tokenId } = await req.json()
    if (!tokenId) {
      return NextResponse.json({ message: "QR Kod eksik" }, { status: 400 })
    }

    const token = await prisma.qrToken.findUnique({
      where: { id: tokenId }
    })

    if (!token) {
      return NextResponse.json({ message: "Geçersiz QR kod" }, { status: 400 })
    }

    if (token.type !== "EARN") {
      return NextResponse.json({ message: "Bu kod puan kazanmak için kullanılamaz" }, { status: 400 })
    }

    if (token.status === "USED") {
      return NextResponse.json({ message: "Bu QR kod daha önce kullanılmış" }, { status: 400 })
    }

    if (new Date() > token.expiresAt) {
      return NextResponse.json({ message: "Bu QR kodun süresi dolmuş" }, { status: 400 })
    }

    // Process the scan using transaction to prevent race conditions
    await prisma.$transaction(async (tx) => {
      // 1. Mark token as used
      await tx.qrToken.update({
        where: { id: tokenId },
        data: { status: "USED" }
      })

      // 2. Add points to customer
      await tx.user.update({
        where: { id: session.user.id },
        data: { loyaltyPoints: { increment: token.points } }
      })

      // 3. Record transaction
      await tx.transaction.create({
        data: {
          type: "EARN",
          customerId: session.user.id,
          cashierId: token.creatorId,
          points: token.points
        }
      })
    })

    return NextResponse.json({ message: "Puan başarıyla eklendi", pointsAdded: token.points }, { status: 200 })
  } catch (error) {
    console.error("Scan Earn QR Error:", error)
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 })
  }
}
