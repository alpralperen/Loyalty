"use client"

import { Menu, ScanLine, Camera, QrCode, ChevronRight } from "lucide-react"
import { useState } from "react"
// Normally we'd import html5-qrcode here for real scanning, but for UI mockup we use placeholders.

export default function CashierDashboard() {
  const [isScanning, setIsScanning] = useState(false)
  const [message, setMessage] = useState("")

  const startScanner = () => {
    // In a real app, initialize html5-qrcode here
    setIsScanning(true)
    setMessage("")
    
    // Simulate successful scan after 3 seconds for demonstration
    setTimeout(() => {
      setIsScanning(false)
      setMessage("Kullanıcı başarıyla okutuldu, puan eklendi!")
    }, 3000)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 pt-4">
        <h1 className="text-xl font-bold text-green-800 tracking-tight">Kasiyer Paneli</h1>
        <button className="p-2 bg-white rounded-full shadow-sm">
          <Menu size={20} className="text-gray-600" />
        </button>
      </header>

      {/* Main Scanner Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm mb-6 border border-gray-100 flex flex-col items-center">
        <h2 className="font-bold text-gray-800 text-lg mb-1">Müşteri QR kodunu tarayın</h2>
        <p className="text-sm text-gray-500 mb-8 text-center">Kamerayı açarak müşterinin QR kodunu okutun.</p>
        
        <div className="w-full aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 mb-8 flex items-center justify-center relative overflow-hidden">
          {isScanning ? (
            <div className="absolute inset-0 bg-black/5 flex flex-col items-center justify-center">
               <div className="w-48 h-48 border-2 border-green-500 relative">
                  {/* Scanning animation line */}
                  <div className="w-full h-1 bg-green-500 absolute top-0 animate-[scan_2s_ease-in-out_infinite]"></div>
                  
                  {/* Corner marks */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-green-500"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-green-500"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-green-500"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-green-500"></div>
               </div>
               <p className="mt-4 text-green-700 font-medium">Taranıyor...</p>
            </div>
          ) : (
            <div className="text-center">
              <ScanLine size={64} className="text-gray-300 mx-auto mb-2" />
              <div className="grid grid-cols-2 gap-8 text-gray-300 mt-2">
                 <div className="w-4 h-4 border-t-4 border-l-4 border-gray-300"></div>
                 <div className="w-4 h-4 border-t-4 border-r-4 border-gray-300"></div>
                 <div className="w-4 h-4 border-b-4 border-l-4 border-gray-300"></div>
                 <div className="w-4 h-4 border-b-4 border-r-4 border-gray-300"></div>
              </div>
            </div>
          )}
        </div>

        {message && (
          <div className="w-full mb-4 p-3 bg-green-50 text-green-700 text-sm font-medium rounded-xl text-center">
            {message}
          </div>
        )}

        <button 
          onClick={startScanner}
          disabled={isScanning}
          className="w-full bg-[#1e4620] hover:bg-[#153216] text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          <Camera size={20} />
          {isScanning ? "Kamera Açık" : "Kamerayı Aç"}
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-6 px-4">
        <div className="h-px bg-gray-200 flex-1"></div>
        <span className="text-sm text-gray-400 font-medium">veya</span>
        <div className="h-px bg-gray-200 flex-1"></div>
      </div>

      {/* Secondary Action */}
      <button className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-xl text-green-700">
            <QrCode size={24} />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-gray-800 text-sm">Kendi QR Kodumu Göster</h3>
            <p className="text-xs text-gray-500">Müşterinin taratması için kendi QR kodunuzu gösterin.</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-gray-400" />
      </button>
      
      {/* Add custom CSS for the scan animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}} />
    </div>
  )
}
