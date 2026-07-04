"use client"

import { useState, useEffect } from "react"
import { QrCode, ScanLine, X, CheckCircle2, Coffee, Star } from "lucide-react"
import { Html5QrcodeScanner } from "html5-qrcode"
import { QRCodeSVG } from "qrcode.react"

export default function CashierDashboardClient({ cashierName }: { cashierName: string }) {
  const [activeTab, setActiveTab] = useState<"GENERATE" | "SCAN">("GENERATE")
  const [pointsInput, setPointsInput] = useState<number>(10)
  const [generatedQr, setGeneratedQr] = useState<string | null>(null)
  const [scanResult, setScanResult] = useState<{ success: boolean, message: string } | null>(null)

  // Scan Reward Logic
  useEffect(() => {
    if (activeTab === "SCAN") {
      const scanner = new Html5QrcodeScanner(
        "reward-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      )

      scanner.render(async (decodedText) => {
        scanner.clear()
        try {
          const res = await fetch("/api/qr/scan-redeem", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tokenId: decodedText })
          })
          const data = await res.json()
          setScanResult({ success: res.ok, message: data.message })
          if (res.ok) {
            setTimeout(() => {
              setScanResult(null)
              setActiveTab("GENERATE")
            }, 3000)
          }
        } catch (error) {
          setScanResult({ success: false, message: "Tarama hatası" })
        }
      }, (error) => {
        // Ignore scan errors
      })

      return () => {
        scanner.clear().catch(e => console.error("Scanner clear error", e))
      }
    }
  }, [activeTab])

  // Generate Points Logic
  const handleGenerate = async () => {
    try {
      const res = await fetch("/api/qr/generate-earn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points: pointsInput })
      })
      const data = await res.json()
      if (res.ok) {
        setGeneratedQr(data.tokenId)
      } else {
        alert(data.message)
      }
    } catch (error) {
      alert("Hata oluştu")
    }
  }

  return (
    <div className="p-6 relative font-sans">
      <header className="flex justify-between items-center mb-8 pt-4">
        <div>
          <p className="text-sm font-medium text-green-600">Kasiyer Paneli</p>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{cashierName}</h1>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex bg-gray-200/50 p-1 rounded-2xl mb-8">
        <button 
          onClick={() => { setActiveTab("GENERATE"); setScanResult(null); }}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
            activeTab === "GENERATE" ? "bg-white text-green-700 shadow-sm" : "text-gray-500"
          }`}
        >
          Puan Oluştur
        </button>
        <button 
          onClick={() => { setActiveTab("SCAN"); setGeneratedQr(null); }}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
            activeTab === "SCAN" ? "bg-white text-green-700 shadow-sm" : "text-gray-500"
          }`}
        >
          Ödül Okut
        </button>
      </div>

      {activeTab === "GENERATE" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          {!generatedQr ? (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
                <Coffee size={32} />
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-6">Puan / Kahve Ekle</h2>
              
              <div className="flex items-center gap-4 mb-8 w-full px-4">
                <button 
                  onClick={() => setPointsInput(Math.max(10, pointsInput - 10))}
                  className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-600 font-bold text-xl hover:bg-gray-200 transition-colors"
                >-</button>
                <div className="flex-1 text-center">
                  <span className="text-4xl font-black text-gray-900">{pointsInput}</span>
                  <span className="block text-xs text-gray-500 font-medium">PUAN</span>
                </div>
                <button 
                  onClick={() => setPointsInput(pointsInput + 10)}
                  className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-600 font-bold text-xl hover:bg-gray-200 transition-colors"
                >+</button>
              </div>

              <button 
                onClick={handleGenerate}
                className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-600/30 hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <QrCode size={20} />
                QR Kodu Oluştur
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
              <h2 className="text-xl font-bold text-green-600 mb-2">Müşteriye Gösterin</h2>
              <p className="text-sm text-gray-500 mb-8">{pointsInput} Puan değerinde kod hazır.</p>
              
              <div className="bg-white p-4 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.05)] border-4 border-green-50 mb-8">
                <QRCodeSVG value={generatedQr} size={220} fgColor="#166534" />
              </div>

              <button 
                onClick={() => setGeneratedQr(null)}
                className="text-gray-500 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors"
              >
                İptal / Yeni Oluştur
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "SCAN" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
              <ScanLine size={32} />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-6">Müşterinin Ödülünü Okut</h2>
            
            <div className="w-full">
              {!scanResult ? (
                <div id="reward-reader" className="rounded-2xl overflow-hidden border-2 border-gray-100 shadow-inner w-full"></div>
              ) : (
                <div className={`p-8 text-center rounded-2xl flex flex-col items-center justify-center ${scanResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${scanResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
                    {scanResult.success ? <CheckCircle2 size={32} /> : <X size={32} />}
                  </div>
                  <p className="font-bold text-lg mb-2">{scanResult.success ? 'Ödül Onaylandı' : 'Hata'}</p>
                  <p className="text-sm opacity-80">{scanResult.message}</p>
                  
                  {!scanResult.success && (
                    <button onClick={() => setScanResult(null)} className="mt-6 px-6 py-2 bg-white/50 rounded-xl font-bold">
                      Tekrar Dene
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
