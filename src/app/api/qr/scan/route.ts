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

    const { customerId } = await req.json()

    if (!customerId) {
      return NextResponse.json({ message: "Müşteri ID gerekli" }, { status: 400 })
    }

    // Verify customer exists
    const customer = await prisma.user.findUnique({
      where: { id: customerId }
    })

    if (!customer || customer.role !== "CUSTOMER") {
      return NextResponse.json({ message: "Geçersiz müşteri" }, { status: 400 })
    }

    const pointsToAdd = 10 // Fixed points per scan for this example

    // Use transaction to ensure both operations succeed
    await prisma.$transaction([
      prisma.transaction.create({
        data: {
          customerId,
          cashierId: session.user.id,
          pointsAdded: pointsToAdd
        }
      }),
      prisma.user.update({
        where: { id: customerId },
        data: { loyaltyPoints: { increment: pointsToAdd } }
      })
    ])

    return NextResponse.json({ message: "Puan eklendi", pointsAdded: pointsToAdd }, { status: 200 })
  } catch (error) {
    console.error("QR Scan Error:", error)
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 })
  }
}
