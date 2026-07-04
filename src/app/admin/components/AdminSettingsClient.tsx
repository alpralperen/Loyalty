"use client"

import { signOut } from "next-auth/react"
import { LogOut, User, Store, Shield, Bell } from "lucide-react"

export default function AdminSettingsClient() {
  return (
    <div className="p-6 relative font-sans">
      <header className="mb-6 pt-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Ayarlar</h1>
        <p className="text-sm text-gray-500 mt-1">Sistem ve hesap ayarları</p>
      </header>

      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-purple-600 mb-4 uppercase tracking-wider">Hesap</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><User size={20} /></div>
                <span className="font-semibold text-gray-800">Profil Bilgileri</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><Shield size={20} /></div>
                <span className="font-semibold text-gray-800">Şifre Değiştir</span>
              </div>
            </button>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-purple-600 mb-4 uppercase tracking-wider">Sistem</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><Store size={20} /></div>
                <span className="font-semibold text-gray-800">Mağaza Bilgileri</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><Bell size={20} /></div>
                <span className="font-semibold text-gray-800">Bildirim Ayarları</span>
              </div>
            </button>
          </div>
        </div>

        {/* Logout */}
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
        >
          <LogOut size={20} />
          Çıkış Yap
        </button>
      </div>
    </div>
  )
}
