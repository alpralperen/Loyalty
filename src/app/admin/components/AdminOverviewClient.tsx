"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Users, CreditCard, Gift, TrendingUp, ArrowUpRight } from "lucide-react"

export default function AdminOverviewClient({ 
  stats, 
  chartData 
}: { 
  stats: { totalUsers: number, totalPoints: number, activeCampaigns: number, totalTransactions: number },
  chartData: any[] 
}) {
  return (
    <div className="p-6 relative font-sans">
      <header className="mb-8 pt-4">
        <p className="text-sm font-medium text-purple-600">Yönetici Paneli</p>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Genel Bakış</h1>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-purple-50 rounded-full group-hover:scale-110 transition-transform"></div>
          <Users className="text-purple-600 mb-3 relative z-10" size={24} />
          <p className="text-xs text-gray-500 font-medium relative z-10">Toplam Müşteri</p>
          <p className="text-2xl font-black text-gray-900 relative z-10">{stats.totalUsers}</p>
        </div>
        
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-green-50 rounded-full group-hover:scale-110 transition-transform"></div>
          <CreditCard className="text-green-600 mb-3 relative z-10" size={24} />
          <p className="text-xs text-gray-500 font-medium relative z-10">Dağıtılan Puan</p>
          <p className="text-2xl font-black text-gray-900 relative z-10">{stats.totalPoints}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-amber-50 rounded-full group-hover:scale-110 transition-transform"></div>
          <Gift className="text-amber-600 mb-3 relative z-10" size={24} />
          <p className="text-xs text-gray-500 font-medium relative z-10">Aktif Kampanyalar</p>
          <p className="text-2xl font-black text-gray-900 relative z-10">{stats.activeCampaigns}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-50 rounded-full group-hover:scale-110 transition-transform"></div>
          <TrendingUp className="text-blue-600 mb-3 relative z-10" size={24} />
          <p className="text-xs text-gray-500 font-medium relative z-10">Toplam İşlem</p>
          <p className="text-2xl font-black text-gray-900 relative z-10">{stats.totalTransactions}</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-gray-800">Son 7 Günlük İşlemler</h2>
          <div className="flex items-center text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded-full">
            <ArrowUpRight size={14} className="mr-1" />
            %12
          </div>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                cursor={{ stroke: '#e5e7eb', strokeWidth: 2, strokeDasharray: '4 4' }}
              />
              <Area type="monotone" dataKey="puan" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorPoints)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
