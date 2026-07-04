import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import AdminCustomersClient from "../components/AdminCustomersClient"

export default async function AdminCustomersPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const customersData = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { loyaltyPoints: "desc" },
    select: {
      id: true,
      name: true,
      phone: true,
      loyaltyPoints: true,
      createdAt: true
    }
  })

  const customers = customersData.map(c => ({
    ...c,
    points: c.loyaltyPoints
  }))

  return (
    <AdminCustomersClient customers={customers} />
  )
}
