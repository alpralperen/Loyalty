"use client"

import { useState, useEffect } from "react"
import { Bell, Camera, Gift, X, Coffee, Star } from "lucide-react"
import { Html5Qrcode } from "html5-qrcode"
import { QRCodeSVG } from "qrcode.react"

export default function CustomerDashboardClient({ user, pointsRequired }: { user: { name: string, points: number }, pointsRequired: number }) {
  const [isScanModalOpen, setIsScanModalOpen] = useState(false)
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false)
  const [rewardQr, setRewardQr] = useState<string | null>(null)
  const [scanResult, setScanResult] = useState<{ success: boolean, message: string } | null>(null)
  
  const progress = Math.min((user.points / pointsRequired) * 100, 100)
  const canRedeem = user.points >= pointsRequired

  useEffect(() => {
    let html5QrCode: Html5Qrcode;
    let isRequesting = false;

    if (isScanModalOpen && !scanResult) {
      html5QrCode = new Html5Qrcode("reader");
      
      html5QrCode.start(
        { facingMode: "environment" }, // Arka kamerayı zorla
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          if (isRequesting) return;
          isRequesting = true;
          
          try {
            await html5QrCode.stop(); // Okuma başarılı olunca kamerayı durdur
            
            const res = await fetch("/api/qr/scan-earn", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ tokenId: decodedText })
            });
            const data = await res.json();
            
            setScanResult({ success: res.ok, message: data.message });
            
            if (res.ok) {
              setTimeout(() => window.location.reload(), 2000);
            }
          } catch (error) {
            setScanResult({ success: false, message: "Tarama hatası" });
          } finally {
            isRequesting = false;
          }
        },
        (errorMessage) => {
          // Her frame'de okuyamadığında hata verir, bunu yoksay
        }
      ).catch((err) => {
        console.error("Kamera başlatılamadı:", err);
      });
    }

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().then(() => html5QrCode.clear()).catch(console.error);
      }
    };
  }, [isScanModalOpen, scanResult])

  const generateReward = async () => {
    try {
      const res = await fetch("/api/qr/generate-redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points: pointsRequired })
      })
      const data = await res.json()
      if (res.ok) {
        setRewardQr(data.tokenId)
      } else {
        alert(data.message)
      }
    } catch (error) {
      alert("Hata oluştu")
    }
  }

  return (
    <div className="p-6 relative">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 pt-4">
        <div>
          <p className="text-sm font-medium text-coffee-600">Hoş Geldin,</p>
          <h1 className="text-2xl font-bold text-coffee-900 tracking-tight">{user.name}</h1>
        </div>
        <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm text-coffee-800 relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </header>

      {/* Premium Loyalty Card */}
      <div className="relative bg-gradient-to-br from-coffee-900 to-coffee-700 rounded-3xl p-6 shadow-2xl overflow-hidden mb-8 border border-white/10">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-gold-500/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div>
            <p className="text-white/70 text-sm font-medium mb-1">Mevcut Puan</p>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-black text-white tracking-tighter">{user.points}</span>
              <span className="text-gold-400 font-bold mb-1">/ {pointsRequired}</span>
            </div>
          </div>
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl">
            <Coffee className="text-gold-400" size={28} />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative z-10">
          <div className="flex justify-between text-xs font-semibold text-white/80 mb-2">
            <span>Başlangıç</span>
            <span>Bedava Kahve</span>
          </div>
          <div className="h-3 w-full bg-black/30 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setIsScanModalOpen(true)}
          className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-cream-200 flex flex-col items-center justify-center gap-3 active:scale-95 transition-all group hover:border-gold-400/50"
        >
          <div className="w-14 h-14 bg-coffee-50 rounded-full flex items-center justify-center text-coffee-800 group-hover:bg-gold-500 group-hover:text-white transition-colors shadow-inner">
            <Camera size={26} />
          </div>
          <div className="text-center">
            <span className="block font-bold text-gray-800 text-sm">Puan Kazan</span>
            <span className="text-[10px] text-gray-500 font-medium">QR Okut</span>
          </div>
        </button>

        <button 
          onClick={() => {
            if (canRedeem) {
              setIsRewardModalOpen(true)
              generateReward()
            }
          }}
          className={`p-5 rounded-3xl flex flex-col items-center justify-center gap-3 active:scale-95 transition-all group ${
            canRedeem 
              ? 'bg-gradient-to-br from-gold-500 to-gold-400 shadow-[0_8px_30px_rgba(212,175,55,0.3)] text-coffee-900 border border-gold-400' 
              : 'bg-gray-100 opacity-60 cursor-not-allowed border border-gray-200'
          }`}
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-inner ${
            canRedeem ? 'bg-white/30 text-coffee-900' : 'bg-gray-200 text-gray-400'
          }`}>
            <Gift size={26} />
          </div>
          <div className="text-center">
            <span className={`block font-bold text-sm ${canRedeem ? 'text-coffee-900' : 'text-gray-500'}`}>Ödülü Kullan</span>
            <span className={`text-[10px] font-medium ${canRedeem ? 'text-coffee-800' : 'text-gray-400'}`}>
              {canRedeem ? 'Bedava Kahve' : `${pointsRequired - user.points} Puan Kaldı`}
            </span>
          </div>
        </button>
      </div>

      {/* Scan Modal */}
      {isScanModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">Kasiyerin QR Kodunu Okut</h3>
              <button onClick={() => { setIsScanModalOpen(false); setScanResult(null); }} className="p-2 bg-white rounded-full shadow-sm text-gray-500 hover:text-red-500">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {!scanResult ? (
                <div id="reader" className="rounded-2xl overflow-hidden border-2 border-coffee-900 shadow-inner"></div>
              ) : (
                <div className={`p-8 text-center rounded-2xl flex flex-col items-center justify-center ${scanResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${scanResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
                    {scanResult.success ? <Star size={32} /> : <X size={32} />}
                  </div>
                  <p className="font-bold text-lg mb-2">{scanResult.success ? 'Tebrikler!' : 'Hata'}</p>
                  <p className="text-sm opacity-80">{scanResult.message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reward Modal */}
      {isRewardModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 relative">
            <div className="absolute top-0 right-0 p-4 z-10">
              <button onClick={() => { setIsRewardModalOpen(false); setRewardQr(null); }} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:text-red-500 shadow-sm">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gold-50 rounded-full flex items-center justify-center mb-4 text-gold-500">
                <Gift size={32} />
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-2">Ödülünüz Hazır!</h3>
              <p className="text-sm text-gray-500 mb-8">Bu QR kodu kasiyere göstererek bedava kahvenizi alabilirsiniz.</p>
              
              <div className="bg-white p-4 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.1)] border-4 border-gold-400/20">
                {rewardQr ? (
                  <QRCodeSVG value={rewardQr} size={200} fgColor="#2c1e16" />
                ) : (
                  <div className="w-[200px] h-[200px] flex items-center justify-center text-gray-400">
                    <span className="animate-pulse">Yükleniyor...</span>
                  </div>
                )}
              </div>
              <p className="text-xs font-bold text-red-500 mt-6">Bu kod 5 dakika boyunca geçerlidir.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
