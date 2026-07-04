"use client"

import { useState } from "react"
import { Megaphone, Plus, Gift, Coffee, MoreVertical, Edit, Trash2, X } from "lucide-react"

export default function AdminCampaignsClient({ initialCampaigns }: { initialCampaigns: any[] }) {
  const [campaigns, setCampaigns] = useState(initialCampaigns)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description })
      })
      if (res.ok) {
        window.location.reload()
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/campaigns/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus })
      })
      if (res.ok) {
        window.location.reload()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kampanyayı silmek istediğinize emin misiniz?")) return
    try {
      const res = await fetch(`/api/campaigns/${id}`, {
        method: "DELETE"
      })
      if (res.ok) {
        window.location.reload()
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-6 relative font-sans pb-24">
      <header className="mb-6 pt-4 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Kampanyalar</h1>
          <p className="text-sm text-gray-500 mt-1">Aktif ve pasif tüm kampanyalar</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold shadow-sm shadow-purple-600/30 hover:bg-purple-700 transition-colors"
        >
          <Plus size={16} /> Yeni
        </button>
      </header>

      {/* Campaign List */}
      <div className="space-y-4">
        {campaigns.length > 0 ? campaigns.map((campaign, i) => (
          <div key={campaign.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-3 group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex gap-4 items-center">
                <div className={`p-3 rounded-2xl flex-shrink-0 ${
                  campaign.isActive ? "bg-purple-50 text-purple-600" : "bg-gray-50 text-gray-400"
                }`}>
                  {i % 2 === 0 ? <Megaphone size={24} /> : <Gift size={24} />}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">{campaign.title}</h3>
                  <button 
                    onClick={() => handleToggle(campaign.id, campaign.isActive)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 inline-block transition-colors ${
                    campaign.isActive ? "bg-green-50 text-green-600 hover:bg-green-100" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}>
                    {campaign.isActive ? "Aktif (Kapat)" : "Pasif (Aç)"}
                  </button>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mt-2">{campaign.description}</p>
            
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50">
              <p className="text-xs text-gray-400 font-medium">
                Oluşturulma: {new Date(campaign.createdAt).toLocaleDateString("tr-TR")}
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleDelete(campaign.id)}
                  className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 border-dashed">
            <Megaphone size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium mb-4">Henüz hiç kampanya yok.</p>
            <button onClick={() => setIsModalOpen(true)} className="px-6 py-2 bg-purple-50 text-purple-600 rounded-xl text-sm font-bold hover:bg-purple-100 transition-colors">
              İlk Kampanyayı Oluştur
            </button>
          </div>
        )}
      </div>

      {/* Add Campaign Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Yeni Kampanya</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Kampanya Başlığı</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Açıklama</label>
                <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all" rows={3}></textarea>
              </div>
              
              <button disabled={loading} type="submit" className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl shadow-md hover:bg-purple-700 transition-colors mt-6 disabled:opacity-50">
                {loading ? "Oluşturuluyor..." : "Oluştur"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
