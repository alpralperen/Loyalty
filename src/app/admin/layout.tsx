import { ReactNode } from "react"
import { BarChart3, Megaphone, Users, Settings } from "lucide-react"
import Link from "next/link"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8f9fe] flex flex-col max-w-md mx-auto relative shadow-xl overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 w-full bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50 rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Link href="/admin" className="flex flex-col items-center text-[#5c3c92] transition-colors">
          <BarChart3 size={24} className="mb-1" />
          <span className="text-[10px] font-semibold">Özet</span>
        </Link>
        <Link href="/admin/campaigns" className="flex flex-col items-center text-gray-400 hover:text-[#5c3c92] transition-colors">
          <Megaphone size={24} className="mb-1" />
          <span className="text-[10px] font-semibold">Kampanyalar</span>
        </Link>
        <Link href="/admin/customers" className="flex flex-col items-center text-gray-400 hover:text-[#5c3c92] transition-colors">
          <Users size={24} className="mb-1" />
          <span className="text-[10px] font-semibold">Müşteriler</span>
        </Link>
        <Link href="/admin/settings" className="flex flex-col items-center text-gray-400 hover:text-[#5c3c92] transition-colors">
          <Settings size={24} className="mb-1" />
          <span className="text-[10px] font-semibold">Ayarlar</span>
        </Link>
      </nav>
    </div>
  )
}
