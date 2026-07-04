"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { LogOut, User, Store, Shield, Bell, Save } from "lucide-react"

export default function AdminSettingsClient({ initialSettings }: { initialSettings: any }) {
  const [storeName, setStoreName] = useState(initialSettings.storeName || "")
  const [pointsRequired, setPointsRequired] = useState(initialSettings.pointsRequired || 100)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })

  const handleSaveSettings = async () => {
    setLoading(true)
    setMessage({ text: "", type: "" })
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeName, pointsRequired })
      })
      if (res.ok) {
        setMessage({ text: "Ayarlar başarıyla güncellendi", type: "success" })
      } else {
        setMessage({ text: "Ayarlar güncellenirken bir hata oluştu", type: "error" })
      }
    } catch (err) {
      setMessage({ text: "Bağlantı hatası", type: "error" })
    }
    setLoading(false)
  }

  return (
    <div className="p-6 relative font-sans pb-24">
      <header className="mb-6 pt-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Ayarlar</h1>
        <p className="text-sm text-gray-500 mt-1">Sistem ve hesap ayarları</p>
      </header>

      {message.text && (
        <div className={`p-4 rounded-2xl mb-6 font-medium text-sm ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* System Settings */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-purple-600 mb-4 uppercase tracking-wider flex items-center gap-2">
            <Store size={18} /> Mağaza Ayarları
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">MAĞAZA ADI</label>
              <input 
                type="text" 
                value={storeName}
                onChange={e => setStoreName(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">BEDAVA KAHVE İÇİN GEREKEN PUAN</label>
              <input 
                type="number" 
                value={pointsRequired}
                onChange={e => setPointsRequired(Number(e.target.value))}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all font-medium"
              />
            </div>
            
            <button 
              onClick={handleSaveSettings}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-colors mt-2 disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? "Kaydediliyor..." : "Ayarları Kaydet"}
            </button>
          </div>
        </div>

        {/* Profile Settings (Placeholders) */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 opacity-70">
          <h2 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider flex items-center gap-2">
            <User size={18} /> Hesap (Yakında)
          </h2>
          <div className="space-y-4">
            <button disabled className="w-full flex items-center justify-between p-2 rounded-xl transition-colors text-left cursor-not-allowed">
              <span className="font-medium text-gray-500">Şifre Değiştir</span>
            </button>
            <button disabled className="w-full flex items-center justify-between p-2 rounded-xl transition-colors text-left cursor-not-allowed">
              <span className="font-medium text-gray-500">Bildirim Ayarları</span>
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
