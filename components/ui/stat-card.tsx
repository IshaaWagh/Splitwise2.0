"use client"
import { motion } from "framer-motion"
import { GlassCard } from "./glass-card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string
  sub?: string
  icon: React.ReactNode
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  color?: "indigo" | "emerald" | "rose" | "amber"
  index?: number
}

export function StatCard({ label, value, sub, icon, trend, trendValue, color = "indigo", index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <GlassCard hover className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center text-sm",
            color === "indigo" && "bg-indigo-500/15 text-indigo-400",
            color === "emerald" && "bg-emerald-500/15 text-emerald-400",
            color === "rose" && "bg-rose-500/15 text-rose-400",
            color === "amber" && "bg-amber-500/15 text-amber-400",
          )}>
            {icon}
          </div>
          {trendValue && (
            <span className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              trend === "up" && "bg-emerald-500/10 text-emerald-400",
              trend === "down" && "bg-rose-500/10 text-rose-400",
              trend === "neutral" && "bg-white/5 text-white/40",
            )}>
              {trendValue}
            </span>
          )}
        </div>
        <p className="text-[11px] text-white/40 uppercase tracking-wider font-medium mb-1">{label}</p>
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
        {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
      </GlassCard>
    </motion.div>
  )
}