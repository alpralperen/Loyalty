import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "CASHIER") {
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

    if (token.type !== "REDEEM") {
      return NextResponse.json({ message: "Bu kod ödül kullanmak için geçerli değil" }, { status: 400 })
    }

    if (token.status === "USED") {
      return NextResponse.json({ message: "Bu ödül daha önce kullanılmış" }, { status: 400 })
    }

    if (new Date() > token.expiresAt) {
      return NextResponse.json({ message: "Bu QR kodun süresi dolmuş" }, { status: 400 })
    }

    const customer = await prisma.user.findUnique({
      where: { id: token.creatorId }
    })

    if (!customer || customer.loyaltyPoints < token.points) {
      return NextResponse.json({ message: "Müşterinin yeterli puanı yok" }, { status: 400 })
    }

    // Process the scan using transaction to prevent race conditions
    await prisma.$transaction(async (tx) => {
      // 1. Mark token as used
      await tx.qrToken.update({
        where: { id: tokenId },
        data: { status: "USED" }
      })

      // 2. Deduct points from customer
      await tx.user.update({
        where: { id: token.creatorId },
        data: { loyaltyPoints: { decrement: token.points } }
      })

      // 3. Record transaction
      await tx.transaction.create({
        data: {
          type: "REDEEM",
          customerId: token.creatorId,
          cashierId: session.user.id,
          points: token.points
        }
      })
    })

    return NextResponse.json({ message: "Ödül başarıyla onaylandı", pointsDeducted: token.points }, { status: 200 })
  } catch (error) {
    console.error("Scan Redeem QR Error:", error)
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 })
  }
}
