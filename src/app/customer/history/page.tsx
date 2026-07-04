import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { History, Coffee, Gift, ChevronDown } from "lucide-react"

export default async function CustomerHistory() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "CUSTOMER") {
    redirect("/login")
  }

  const transactions = await prisma.transaction.findMany({
    where: { customerId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { cashier: { select: { name: true } } }
  })

  return (
    <div className="p-6 relative font-sans pb-24 min-h-screen">
      <header className="mb-6 pt-4">
        <h1 className="text-2xl font-bold text-coffee-900 tracking-tight">İşlem Geçmişi</h1>
        <p className="text-sm text-coffee-600 mt-1">Puan kazanım ve harcama detaylarınız</p>
      </header>

      <div className="space-y-3">
        {transactions.length > 0 ? transactions.map((transaction) => (
          <div key={transaction.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gold-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${
                transaction.type === "EARN" ? "bg-green-50 text-green-600" : "bg-gold-50 text-gold-600"
              }`}>
                {transaction.type === "EARN" ? <Coffee size={20} /> : <Gift size={20} />}
              </div>
              <div>
                <p className="font-bold text-coffee-900 text-sm">
                  {transaction.type === "EARN" ? "Puan Kazanıldı" : "Ödül Kullanıldı"}
                </p>
                <div className="text-[10px] font-medium text-coffee-500 mt-0.5 flex gap-1 items-center">
                  <span>{new Date(transaction.createdAt).toLocaleDateString("tr-TR")}</span>
                  <span>•</span>
                  <span>Kasiyer: {transaction.cashier.name.split(" ")[0]}</span>
                </div>
              </div>
            </div>
            
            <div className={`font-black ${transaction.type === "EARN" ? "text-green-600" : "text-gold-600"}`}>
              {transaction.type === "EARN" ? "+" : "-"}{transaction.points}
            </div>
          </div>
        )) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-gold-100 border-dashed">
            <History size={40} className="mx-auto text-gold-300 mb-4" />
            <p className="text-coffee-600 font-medium px-4">Henüz bir işlem geçmişiniz bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  )
}
