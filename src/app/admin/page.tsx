import { Menu, Calendar, Scan, Users, Star, Megaphone, Gift, Coffee, MoreVertical, Plus } from "lucide-react"
import prisma from "@/lib/prisma"

export default async function AdminDashboard() {
  // Fetch stats (in a real app, these would be calculated based on the selected date range)
  const totalUsers = await prisma.user.count({ where: { role: "CUSTOMER" } })
  const totalTransactions = await prisma.transaction.count()
  const totalPointsAgg = await prisma.transaction.aggregate({
    _sum: { pointsAdded: true }
  })
  const totalPoints = totalPointsAgg._sum.pointsAdded || 0

  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-6 pt-4">
        <h1 className="text-xl font-bold text-[#5c3c92] tracking-tight">Yönetici Paneli</h1>
        <button className="p-2 bg-white rounded-full shadow-sm">
          <Menu size={20} className="text-gray-600" />
        </button>
      </header>

      {/* Overview Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-800 text-lg">Genel Bakış</h2>
          <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-[#5c3c92] font-medium shadow-sm">
            7 Gün <Calendar size={14} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Card 1 */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="p-2 bg-[#f3efff] rounded-xl text-[#5c3c92] mb-3">
              <Scan size={24} />
            </div>
            <span className="text-xl font-bold text-gray-800">{totalTransactions.toLocaleString()}</span>
            <span className="text-[10px] text-gray-500 font-medium mt-1 leading-tight">Taranan QR Adedi</span>
            <span className="text-[10px] text-green-600 font-bold mt-2 flex items-center">
              ↗ %12.5
            </span>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="p-2 bg-[#e8f4fe] rounded-xl text-[#2185d0] mb-3">
              <Users size={24} />
            </div>
            <span className="text-xl font-bold text-gray-800">{totalUsers.toLocaleString()}</span>
            <span className="text-[10px] text-gray-500 font-medium mt-1 leading-tight">Toplam Müşteri</span>
            <span className="text-[10px] text-green-600 font-bold mt-2 flex items-center">
              ↗ %8.1
            </span>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="p-2 bg-[#fff4e5] rounded-xl text-[#f2711c] mb-3">
              <Star size={24} />
            </div>
            <span className="text-xl font-bold text-gray-800">{totalPoints.toLocaleString()}</span>
            <span className="text-[10px] text-gray-500 font-medium mt-1 leading-tight">Dağıtılan Puan</span>
            <span className="text-[10px] text-green-600 font-bold mt-2 flex items-center">
              ↗ %15.3
            </span>
          </div>
        </div>
      </div>

      {/* Campaigns Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-800 text-lg">Kampanyalar</h2>
          <button className="flex items-center gap-1 px-4 py-2 bg-[#5c3c92] text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-[#4a2e7a] transition-colors">
            <Plus size={16} /> Yeni Kampanya
          </button>
        </div>

        <div className="space-y-3">
          {campaigns.length > 0 ? campaigns.map((campaign, i) => (
            <div key={campaign.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center">
              <div className={`p-3 rounded-xl flex-shrink-0 ${
                i === 0 ? "bg-[#f3efff] text-[#5c3c92]" : 
                i === 1 ? "bg-[#f3efff] text-[#5c3c92]" : 
                "bg-gray-50 text-gray-500"
              }`}>
                {i === 0 ? <Megaphone size={24} /> : i === 1 ? <Gift size={24} /> : <Coffee size={24} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-800 text-sm truncate pr-2">{campaign.title}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0 ${
                    campaign.isActive ? "bg-[#e8f7ec] text-[#2ebd59]" : "bg-gray-100 text-gray-500"
                  }`}>
                    {campaign.isActive ? "Aktif" : "Pasif"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-1 line-clamp-1">{campaign.description}</p>
                <p className="text-[10px] text-gray-400">
                  {new Date(campaign.createdAt).toLocaleDateString("tr-TR")}
                </p>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>
          )) : (
            <div className="text-sm text-gray-500 italic p-6 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
              Henüz kampanya oluşturulmamış.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
