import { Bell, Scan, History, ChevronRight, Clock } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import Link from "next/link"

export default async function CustomerDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { loyaltyPoints: true, name: true, phone: true }
  })

  // Get active campaigns
  const campaigns = await prisma.campaign.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 1
  })

  const points = user?.loyaltyPoints || 0
  const maxPoints = 300 // example target
  const progress = Math.min((points / maxPoints) * 100, 100)

  // We encode the user's phone or ID in the QR code
  const qrData = JSON.stringify({ customerId: session.user.id, type: "customer" })

  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-6 pt-4">
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">Cafe Loyalty</h1>
        <button className="p-2 bg-white rounded-full shadow-sm">
          <Bell size={20} className="text-gray-600" />
        </button>
      </header>

      {/* Loyalty Card */}
      <div className="bg-gradient-to-br from-[#744521] to-[#5a3214] rounded-3xl p-6 text-white shadow-lg mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/></svg>
        </div>
        <p className="text-sm text-[#e6ccb8] mb-1 font-medium">Sadakat Kartım</p>
        <div className="flex items-baseline mb-4">
          <span className="text-5xl font-bold">{points}</span>
          <span className="ml-2 text-xl">★</span>
        </div>
        <p className="text-xs text-[#e6ccb8] mb-4">
          {maxPoints - points > 0 
            ? `${maxPoints - points} puan daha topla, ödül kazanmaya hak kazan!`
            : "Ödülünüzü alabilirsiniz!"}
        </p>
        <div className="w-full bg-[#8b5a33] rounded-full h-1.5 mb-2">
          <div className="bg-white h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="text-right text-[10px] text-[#e6ccb8] font-medium">
          {points} / {maxPoints}
        </div>
      </div>

      {/* QR Code Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm mb-4 border border-gray-100 flex flex-col items-center">
        <div className="w-full mb-4">
          <h2 className="font-bold text-gray-800 text-lg">QR Kodum</h2>
          <p className="text-xs text-gray-500">Kasiyere okutmanız için QR kodunuzu gösterin.</p>
        </div>
        <div className="p-4 bg-white border-2 border-gray-100 rounded-2xl mb-3 shadow-inner">
          <QRCodeSVG value={qrData} size={150} level="M" />
        </div>
        <p className="text-[10px] text-gray-400 flex items-center">
          <Clock size={12} className="mr-1" /> 00:48 sonra yenilenecek
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Link href="/customer/scan" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
          <div className="p-3 bg-gray-50 rounded-xl">
            <Scan size={24} className="text-gray-800" />
          </div>
          <span className="text-sm font-semibold text-gray-800">QR Tara</span>
        </Link>
        <Link href="/customer/history" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
          <div className="p-3 bg-gray-50 rounded-xl">
            <History size={24} className="text-gray-800" />
          </div>
          <span className="text-sm font-semibold text-gray-800">İşlem Geçmişim</span>
        </Link>
      </div>

      {/* Announcements Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-800">Duyurular & Kampanyalar</h3>
          <Link href="/customer/campaigns" className="text-xs text-[#8B4513] font-semibold flex items-center hover:underline">
            Tümünü Gör <ChevronRight size={14} />
          </Link>
        </div>
        
        {campaigns.length > 0 ? (
          <div className="bg-[#fff9f5] border border-[#f5e6db] rounded-2xl p-4 flex gap-4 items-center">
            <div className="bg-[#cc5533] p-4 rounded-xl flex-shrink-0 text-white">
              <Gift size={24} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-gray-800 text-sm">{campaigns[0].title}</h4>
                <span className="text-[9px] font-bold px-2 py-0.5 bg-[#fce8e3] text-[#cc5533] rounded-md">Aktif</span>
              </div>
              <p className="text-xs text-gray-600 mb-1 leading-snug line-clamp-2">
                {campaigns[0].description}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic p-4 text-center bg-gray-50 rounded-2xl border border-gray-100">
            Şu an aktif kampanya bulunmuyor.
          </div>
        )}
      </div>
    </div>
  )
}
