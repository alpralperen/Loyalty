import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import AdminSettingsClient from "../components/AdminSettingsClient"

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  let setting = await prisma.setting.findUnique({
    where: { id: "default" }
  })
  if (!setting) {
    setting = { id: "default", pointsRequired: 100, storeName: "Premium Coffee", updatedAt: new Date() }
  }

  return <AdminSettingsClient initialSettings={setting} />
}
