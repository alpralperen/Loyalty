import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const role = session.user.role

  if (role === "CUSTOMER") {
    redirect("/customer")
  } else if (role === "CASHIER") {
    redirect("/cashier")
  } else if (role === "ADMIN") {
    redirect("/admin")
  } else {
    redirect("/login")
  }
}
