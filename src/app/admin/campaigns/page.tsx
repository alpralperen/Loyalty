import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import AdminCampaignsClient from "../components/AdminCampaignsClient"

export default async function AdminCampaignsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" }
  })

  return (
    <AdminCampaignsClient initialCampaigns={campaigns} />
  )
}
