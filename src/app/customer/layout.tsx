import { ReactNode } from "react"
import { Home, Gift, Clock, User } from "lucide-react"
import Link from "next/link"

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col max-w-md mx-auto relative shadow-2xl overflow-hidden font-sans">
      {/* Background Decor (Subtle gradient for premium feel) */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-coffee-900 via-coffee-800 to-transparent -z-10 rounded-b-[40px]" />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 z-10">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-cream-200 px-6 py-4 flex justify-between items-center z-50 rounded-t-3xl shadow-[0_-10px_40px_-10px_rgba(44,30,22,0.1)]">
        <Link href="/customer" className="flex flex-col items-center text-gold-500 transition-colors group">
          <div className="p-2 bg-gold-500/10 rounded-full mb-1 group-hover:scale-110 transition-transform">
            <Home size={22} className="text-gold-500" />
          </div>
          <span className="text-[10px] font-bold tracking-wide">Ana Sayfa</span>
        </Link>
        <Link href="/customer/campaigns" className="flex flex-col items-center text-gray-400 hover:text-coffee-600 transition-colors group">
          <div className="p-2 mb-1 group-hover:bg-coffee-900/5 rounded-full group-hover:scale-110 transition-all">
            <Gift size={22} />
          </div>
          <span className="text-[10px] font-medium tracking-wide">Kampanyalar</span>
        </Link>
        <Link href="/customer/history" className="flex flex-col items-center text-gray-400 hover:text-coffee-600 transition-colors group">
          <div className="p-2 mb-1 group-hover:bg-coffee-900/5 rounded-full group-hover:scale-110 transition-all">
            <Clock size={22} />
          </div>
          <span className="text-[10px] font-medium tracking-wide">Geçmiş</span>
        </Link>
        <Link href="/customer/profile" className="flex flex-col items-center text-gray-400 hover:text-coffee-600 transition-colors group">
          <div className="p-2 mb-1 group-hover:bg-coffee-900/5 rounded-full group-hover:scale-110 transition-all">
            <User size={22} />
          </div>
          <span className="text-[10px] font-medium tracking-wide">Profil</span>
        </Link>
      </nav>
    </div>
  )
}
