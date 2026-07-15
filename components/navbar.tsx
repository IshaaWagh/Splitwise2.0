"use client"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react"
import { useState } from "react"
import { getInitials } from "@/lib/utils"

interface NavbarProps {
  user: { name?: string | null; email?: string | null; image?: string | null }
}

export function Navbar({ user }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-xl"
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-semibold text-white text-sm tracking-tight">Splitwise 2.0</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {[
  { label: "Dashboard", href: "/dashboard" },
  { label: "Groups", href: "/dashboard" },
  { label: "Activity", href: "/dashboard" },
].map((link) => (
  <Link
    key={link.label}   // 👈 was key={link.href} — caused duplicates
    href={link.href}
    className="px-3 py-1.5 text-sm text-white/50 hover:text-white/80 rounded-lg hover:bg-white/[0.05] transition-all"
  >
    {link.label}
  </Link>
))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all">
            <Bell size={15} />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-white/[0.06] transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
                {user.image ? (
                  <img src={user.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  getInitials(user.name ?? "U")
                )}
              </div>
              <span className="text-xs text-white/60 hidden md:block">{user.name?.split(" ")[0]}</span>
              <ChevronDown size={12} className="text-white/30" />
            </button>

            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute right-0 mt-1 w-48 rounded-xl border border-white/[0.08] bg-[#0f0f0f] shadow-xl shadow-black/40 overflow-hidden"
              >
                <div className="p-2 border-b border-white/[0.06]">
                  <p className="text-xs font-medium text-white/80 px-2 py-1">{user.name}</p>
                  <p className="text-[11px] text-white/30 px-2">{user.email}</p>
                </div>
                <div className="p-1">
                  {[
                    { icon: <User size={13} />, label: "Profile" },
                    { icon: <Settings size={13} />, label: "Settings" },
                  ].map((item) => (
                    <button key={item.label} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-white/50 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all">
                      {item.icon}{item.label}
                    </button>
                  ))}
                  <button
                    onClick={() => signOut({ callbackUrl: "/signin" })}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/[0.05] rounded-lg transition-all"
                  >
                    <LogOut size={13} />Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}