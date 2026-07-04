"use client"

import { BarChart3, Megaphone, Users, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function AdminBottomNav() {
  const pathname = usePathname()

  const tabs = [
    { name: "Özet", path: "/admin", icon: BarChart3 },
    { name: "Kampanyalar", path: "/admin/campaigns", icon: Megaphone },
    { name: "Çalışanlar", path: "/admin/staff", icon: Users },
    { name: "Ayarlar", path: "/admin/settings", icon: Settings }
  ]

  return (
    <nav className="absolute bottom-0 w-full bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50 rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {tabs.map((tab) => {
        const isActive = pathname === tab.path
        const Icon = tab.icon
        return (
          <Link 
            key={tab.path}
            href={tab.path} 
            className={`flex flex-col items-center transition-colors ${isActive ? 'text-purple-600' : 'text-gray-400 hover:text-purple-600'}`}
          >
            <Icon size={24} className="mb-1" />
            <span className="text-[10px] font-semibold">{tab.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
