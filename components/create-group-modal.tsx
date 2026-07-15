"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles } from "lucide-react"

const GROUP_EMOJIS = ["✈️", "🏠", "🍕", "🎉", "💼", "🏕️", "🎮", "🚗", "💪", "🌴", "🎓", "❤️"]
const GROUP_COLORS = [
  { from: "#6366f1", to: "#8b5cf6" },
  { from: "#ec4899", to: "#f43f5e" },
  { from: "#10b981", to: "#059669" },
  { from: "#f59e0b", to: "#f97316" },
  { from: "#3b82f6", to: "#6366f1" },
  { from: "#8b5cf6", to: "#d946ef" },
]

export default function CreateGroupModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("")
  const [emoji, setEmoji] = useState("✈️")
  const [colorIdx, setColorIdx] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const color = GROUP_COLORS[colorIdx]

  async function handleSubmit() {
    if (!name.trim()) return setError("Give your group a name")
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push(`/group/${data.id}`)
      router.refresh()
      onClose()
    } catch (e: any) {
      setError(e.message)
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed", inset: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
          padding: 16,
        }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 24 }}
          transition={{ type: "spring", duration: 0.4 }}
          style={{
            width: "100%", maxWidth: 480,
            background: "#0d0d0d",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          {/* Top gradient bar */}
          <div style={{ height: 3, background: `linear-gradient(90deg, ${color.from}, ${color.to})` }} />

          <div style={{ padding: "28px 28px 24px" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.3px" }}>
                  Create a group
                </h2>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: "4px 0 0" }}>
                  Invite friends and start splitting instantly
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center",
                  justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.4)",
                }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Avatar preview */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
              <div style={{
                width: 72, height: 72, borderRadius: 20,
                background: `linear-gradient(135deg, ${color.from}, ${color.to})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32, boxShadow: `0 8px 32px ${color.from}40`,
                transition: "all 0.3s",
              }}>
                {emoji}
              </div>
            </div>

            {/* Group name */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                Group name
              </label>
              <input
                autoFocus
                type="text"
                placeholder="e.g. Goa Trip 2025, Flat Expenses..."
                value={name}
                onChange={(e) => { setName(e.target.value); setError("") }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                style={{
                  width: "100%", padding: "13px 16px",
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${error ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 12, fontSize: 14, color: "#fff",
                  outline: "none", boxSizing: "border-box",
                  transition: "border-color 0.2s",
                  fontFamily: "inherit",
                }}
                onFocus={e => e.target.style.borderColor = `${color.from}80`}
                onBlur={e => e.target.style.borderColor = error ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.08)"}
              />
              {error && (
                <p style={{ fontSize: 12, color: "#f87171", margin: "6px 0 0" }}>{error}</p>
              )}
            </div>

            {/* Emoji picker */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                Pick an icon
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {GROUP_EMOJIS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEmoji(e)}
                    style={{
                      width: 40, height: 40, borderRadius: 10, fontSize: 20,
                      border: `1px solid ${emoji === e ? `${color.from}60` : "rgba(255,255,255,0.06)"}`,
                      background: emoji === e ? `${color.from}15` : "rgba(255,255,255,0.03)",
                      cursor: "pointer", transition: "all 0.15s",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                Color theme
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                {GROUP_COLORS.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setColorIdx(i)}
                    style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: `linear-gradient(135deg, ${c.from}, ${c.to})`,
                      border: colorIdx === i ? "2px solid #fff" : "2px solid transparent",
                      cursor: "pointer", transition: "all 0.15s",
                      outline: colorIdx === i ? `2px solid ${c.from}` : "none",
                      outlineOffset: 2,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1, padding: "13px 0", borderRadius: 12, fontSize: 14, fontWeight: 500,
                  border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.5)", cursor: "pointer", transition: "all 0.2s",
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  flex: 2, padding: "13px 0", borderRadius: 12, fontSize: 14, fontWeight: 600,
                  border: "none",
                  background: loading ? "rgba(99,102,241,0.4)" : `linear-gradient(135deg, ${color.from}, ${color.to})`,
                  color: "#fff", cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: 8,
                  boxShadow: loading ? "none" : `0 4px 20px ${color.from}40`,
                  fontFamily: "inherit",
                }}
              >
                {loading ? (
                  <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", animation: "spin 0.8s linear infinite" }} />
                ) : (
                  <>
                    <Sparkles size={14} />
                    Create Group
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </AnimatePresence>
  )
}