import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import CustomerDashboardClient from "./components/CustomerDashboardClient"
import { redirect } from "next/navigation"

export default async function CustomerPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "CUSTOMER") {
    redirect("/login")
  }

  // Fetch updated user info from db
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  })

  if (!user) {
    redirect("/login")
  }

  // Fetch settings
  let setting = await prisma.setting.findUnique({ where: { id: "default" } })
  const pointsRequired = setting?.pointsRequired || 100

  return (
    <CustomerDashboardClient user={{ name: user.name, points: user.loyaltyPoints }} pointsRequired={pointsRequired} />
  )
}
