import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import CashierDashboardClient from "./components/CashierDashboardClient"
import { redirect } from "next/navigation"

export default async function CashierPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "CASHIER") {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <CashierDashboardClient cashierName={user.name} />
  )
}
