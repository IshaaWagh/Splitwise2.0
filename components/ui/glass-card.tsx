import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hover?: boolean
  glow?: "indigo" | "violet" | "emerald" | "none"
}

export function GlassCard({ children, className, hover, glow = "none", ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl",
        hover && "transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.06] hover:-translate-y-0.5",
        glow === "indigo" && "shadow-[0_0_30px_rgba(99,102,241,0.08)]",
        glow === "violet" && "shadow-[0_0_30px_rgba(139,92,246,0.08)]",
        glow === "emerald" && "shadow-[0_0_30px_rgba(16,185,129,0.08)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}