import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import AdminOverviewClient from "./components/AdminOverviewClient"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  // Fetch actual stats
  const totalUsers = await prisma.user.count({ where: { role: "CUSTOMER" } })
  const totalTransactions = await prisma.transaction.count()
  
  const totalPointsAgg = await prisma.transaction.aggregate({
    _sum: { points: true }
  })
  const totalPoints = totalPointsAgg._sum.points || 0

  const activeCampaigns = await prisma.campaign.count({
    where: { isActive: true }
  })

  const recentLogs = await prisma.transaction.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { name: true } },
      cashier: { select: { name: true } }
    }
  })

  // Group transactions by day for the chart (Mocking last 7 days for the chart, in real app group by date from DB)
  // Generating mock chart data since SQLite grouping by day can be complex in Prisma without raw queries
  const today = new Date()
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (6 - i))
    return {
      name: d.toLocaleDateString("tr-TR", { weekday: 'short' }),
      puan: Math.floor(Math.random() * 500) + 100 // Mock data
    }
  })

  const stats = {
    totalUsers,
    totalPoints,
    activeCampaigns,
    totalTransactions
  }

  return (
    <AdminOverviewClient stats={stats} chartData={chartData} recentLogs={recentLogs} />
  )
}
