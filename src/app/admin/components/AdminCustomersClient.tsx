"use client"

import { useState } from "react"
import { Users, Search, MoreVertical, Coffee, ChevronRight } from "lucide-react"

export default function AdminCustomersClient({ customers }: { customers: any[] }) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  )

  return (
    <div className="p-6 relative font-sans">
      <header className="mb-6 pt-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Müşteriler</h1>
        <p className="text-sm text-gray-500 mt-1">Sistemdeki kayıtlı tüm müşterileriniz</p>
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

      {/* Customer List */}
      <div className="space-y-3">
        {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-purple-200 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 font-bold text-lg">
                {customer.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{customer.name}</h3>
                <p className="text-xs text-gray-500">{customer.phone}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="block text-lg font-black text-gray-900 leading-none">{customer.points}</span>
                <span className="text-[10px] font-bold text-gray-400">PUAN</span>
              </div>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-10 bg-white rounded-3xl border border-gray-100 border-dashed">
            <Users size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Müşteri bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  )
}
