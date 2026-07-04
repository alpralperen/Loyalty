import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdminSettingsClient from "../components/AdminSettingsClient"

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  return <AdminSettingsClient />
}
