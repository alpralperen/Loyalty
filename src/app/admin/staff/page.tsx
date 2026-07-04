import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import AdminStaffClient from "../components/AdminStaffClient"

export default async function AdminStaffPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  // Fetch cashiers
  const cashiersData = await prisma.user.findMany({
    where: { role: "CASHIER" },
    select: {
      id: true,
      name: true,
      phone: true,
      createdAt: true,
      _count: {
        select: {
          cashierTransactions: true,
          createdTokens: true
        }
      },
      cashierTransactions: {
        select: { points: true }
      }
    }
  })

  const staff = cashiersData.map(c => {
    const totalPointsDistributed = c.cashierTransactions.reduce((acc, t) => acc + t.points, 0)
    return {
      id: c.id,
      name: c.name,
      phone: c.phone,
      createdAt: c.createdAt,
      qrCount: c._count.createdTokens,
      transactionCount: c._count.cashierTransactions,
      pointsDistributed: totalPointsDistributed
    }
  })

  return (
    <AdminStaffClient staff={staff} />
  )
}
