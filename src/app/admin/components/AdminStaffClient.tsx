"use client"

import { useState } from "react"
import { Users, Search, MoreVertical, Plus, ScanLine, Gift, X } from "lucide-react"

export default function AdminStaffClient({ staff }: { staff: any[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Form state
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const filteredStaff = staff.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  )

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, password, role: "CASHIER" })
      })

      if (res.ok) {
        setIsModalOpen(false)
        setName("")
        setPhone("")
        setPassword("")
        // Refresh page to see new staff
        window.location.reload()
      } else {
        const data = await res.json()
        setError(data.message || "Bir hata oluştu")
      }
    } catch (err) {
      setError("Bağlantı hatası")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 relative font-sans pb-24">
      <header className="mb-6 pt-4 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Çalışanlar</h1>
          <p className="text-sm text-gray-500 mt-1">Kasiyer yönetimi ve istatistikleri</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold shadow-sm shadow-purple-600/30 hover:bg-purple-700 transition-colors"
        >
          <Plus size={16} /> Ekle
        </button>
      </header>

      {/* Search */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input 
          type="text" 
          placeholder="İsim veya telefon numarası ara..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
        />
      </div>

      {/* Staff List */}
      <div className="space-y-4">
        {filteredStaff.length > 0 ? filteredStaff.map((member) => (
          <div key={member.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col group hover:border-purple-200 transition-colors">
            <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 font-bold text-lg">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{member.name}</h3>
                  <p className="text-xs text-gray-500">{member.phone}</p>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-lg">
                <MoreVertical size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 p-3 rounded-2xl flex flex-col justify-center items-center text-center">
                <ScanLine size={16} className="text-blue-500 mb-1" />
                <span className="text-lg font-black text-gray-900 leading-none">{member.qrCount}</span>
                <span className="text-[10px] font-bold text-gray-500 mt-1">QR ÜRETİMİ</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-2xl flex flex-col justify-center items-center text-center">
                <Gift size={16} className="text-green-500 mb-1" />
                <span className="text-lg font-black text-gray-900 leading-none">{member.pointsDistributed}</span>
                <span className="text-[10px] font-bold text-gray-500 mt-1">DAĞITILAN PUAN</span>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-10 bg-white rounded-3xl border border-gray-100 border-dashed">
            <Users size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Çalışan bulunamadı</p>
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Yeni Kasiyer Ekle</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            {error && <div className="p-3 bg-red-50 text-red-500 text-sm rounded-xl mb-4 font-medium">{error}</div>}
            
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">İsim Soyisim</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Telefon</label>
                <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Şifre</label>
                <input required type="text" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
              </div>
              
              <button disabled={loading} type="submit" className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl shadow-md hover:bg-purple-700 transition-colors mt-6 disabled:opacity-50">
                {loading ? "Ekleniyor..." : "Personeli Kaydet"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
