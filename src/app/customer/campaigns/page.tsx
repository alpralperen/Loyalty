import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Megaphone, Gift, Coffee, Sparkles } from "lucide-react"

export default async function CustomerCampaigns() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "CUSTOMER") {
    redirect("/login")
  }

  const campaigns = await prisma.campaign.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="p-6 relative font-sans pb-24 min-h-screen">
      <header className="mb-6 pt-4">
        <h1 className="text-2xl font-bold text-coffee-900 tracking-tight">Kampanyalar</h1>
        <p className="text-sm text-coffee-600 mt-1">Size özel güncel fırsatlar</p>
      </header>

      <div className="space-y-4">
        {campaigns.length > 0 ? campaigns.map((campaign, i) => (
          <div key={campaign.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gold-100 flex flex-col gap-3 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-gold-50 rounded-full opacity-50"></div>
            
            <div className="flex gap-4 items-start relative z-10">
              <div className="p-3 bg-gradient-to-br from-gold-100 to-gold-50 text-gold-600 rounded-2xl flex-shrink-0">
                {i % 2 === 0 ? <Gift size={24} /> : <Sparkles size={24} />}
              </div>
              <div>
                <h3 className="font-bold text-coffee-900 text-lg leading-tight">{campaign.title}</h3>
                <p className="text-sm text-coffee-700 mt-2 leading-relaxed">{campaign.description}</p>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-gold-100 border-dashed">
            <Megaphone size={40} className="mx-auto text-gold-300 mb-4" />
            <p className="text-coffee-600 font-medium px-4">Şu anda aktif bir kampanya bulunmuyor. Lütfen daha sonra tekrar kontrol edin.</p>
          </div>
        )}
      </div>
    </div>
  )
}
