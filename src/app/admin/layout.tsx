import { ReactNode } from "react"
import AdminBottomNav from "./components/AdminBottomNav"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8f9fe] flex flex-col max-w-md mx-auto relative shadow-xl overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <AdminBottomNav />
    </div>
  )
}
