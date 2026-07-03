import { ReactNode } from "react"
import { Home, Gift, Clock, User } from "lucide-react"
import Link from "next/link"

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative shadow-xl overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 w-full bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50 rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Link href="/customer" className="flex flex-col items-center text-[#8B4513] transition-colors">
          <Home size={24} className="mb-1" />
          <span className="text-[10px] font-semibold">Ana Sayfa</span>
        </Link>
        <Link href="/customer/campaigns" className="flex flex-col items-center text-gray-400 hover:text-[#8B4513] transition-colors">
          <Gift size={24} className="mb-1" />
          <span className="text-[10px] font-semibold">Kampanyalar</span>
        </Link>
        <Link href="/customer/history" className="flex flex-col items-center text-gray-400 hover:text-[#8B4513] transition-colors">
          <Clock size={24} className="mb-1" />
          <span className="text-[10px] font-semibold">Geçmiş</span>
        </Link>
        <Link href="/customer/profile" className="flex flex-col items-center text-gray-400 hover:text-[#8B4513] transition-colors">
          <User size={24} className="mb-1" />
          <span className="text-[10px] font-semibold">Profil</span>
        </Link>
      </nav>
    </div>
  )
}
