import { ReactNode } from "react"
import { Scan, History } from "lucide-react"
import Link from "next/link"

export default function CashierLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative shadow-xl overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 w-full bg-white border-t border-gray-200 px-12 py-3 flex justify-between items-center z-50 rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Link href="/cashier" className="flex flex-col items-center text-green-700 transition-colors">
          <Scan size={24} className="mb-1" />
          <span className="text-[10px] font-semibold">Tarama</span>
        </Link>
        <Link href="/cashier/history" className="flex flex-col items-center text-gray-400 hover:text-green-700 transition-colors">
          <History size={24} className="mb-1" />
          <span className="text-[10px] font-semibold">Geçmiş</span>
        </Link>
      </nav>
    </div>
  )
}
