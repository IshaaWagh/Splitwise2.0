import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/navbar"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/signin")

  return (
    <div style={{ minHeight: "100vh", background: "#050505", width: "100%" }}>
      {/* Background glows */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, left: "10%", width: 500, height: 500, background: "rgba(99,102,241,0.05)", filter: "blur(120px)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: -100, right: "10%", width: 400, height: 400, background: "rgba(139,92,246,0.04)", filter: "blur(120px)", borderRadius: "50%" }} />
      </div>
      <Navbar user={session.user!} />
      <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto", padding: "32px 32px", boxSizing: "border-box", position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}