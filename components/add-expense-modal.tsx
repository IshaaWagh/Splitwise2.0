"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "./ui/glass-card"
import { GradientButton } from "./ui/gradient-button"
import { X, DollarSign } from "lucide-react"

const CATEGORIES = [
  { id: "food", label: "Food", icon: "🍕" },
  { id: "transport", label: "Transport", icon: "🚗" },
  { id: "accommodation", label: "Stay", icon: "🏠" },
  { id: "entertainment", label: "Fun", icon: "🎮" },
  { id: "shopping", label: "Shopping", icon: "🛍️" },
  { id: "utilities", label: "Bills", icon: "⚡" },
  { id: "general", label: "Other", icon: "📦" },
]

interface AddExpenseModalProps {
  group: any
  currentUserId: string
  onClose: () => void
  onSuccess: () => void
}

export default function AddExpenseModal({ group, currentUserId, onClose, onSuccess }: AddExpenseModalProps) {
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("general")
  const [splitType, setSplitType] = useState("equal")
  const [paidById, setPaidById] = useState(currentUserId)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit() {
    if (!title.trim()) return setError("Please enter a title")
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return setError("Please enter a valid amount")

    setLoading(true)
    setError("")

    try {
      const res = await fetch(`/api/groups/${group.id}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          amount: Number(amount),
          category,
          splitType,
          paidById,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onSuccess()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-md"
        >
          <GlassCard className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold text-white">Add Expense</h2>
                <p className="text-xs text-white/35 mt-0.5">{group.name}</p>
              </div>
              <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.06] transition-all">
                <X size={14} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">What's this for?</label>
                <input
                  autoFocus
                  type="text"
                  placeholder="e.g. Dinner at Barbeque Nation"
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); setError("") }}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">₹</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => { setAmount(e.target.value); setError("") }}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-8 pr-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        category === cat.id
                          ? "bg-indigo-500/20 border border-indigo-500/40 text-indigo-300"
                          : "bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/60 hover:bg-white/[0.07]"
                      }`}
                    >
                      <span>{cat.icon}</span>{cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Paid by */}
              <div>
                <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">Paid by</label>
                <select
                  value={paidById}
                  onChange={(e) => setPaidById(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50 transition-all appearance-none"
                >
                  {group.members.map((m: any) => (
                    <option key={m.userId} value={m.userId} className="bg-[#0f0f0f]">
                      {m.userId === currentUserId ? "You" : m.user.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Split type */}
              <div>
                <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">Split</label>
                <div className="flex gap-2">
                  {[
                    { id: "equal", label: "Equal" },
                    { id: "percentage", label: "By %" },
                    { id: "exact", label: "Exact" },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSplitType(type.id)}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                        splitType === type.id
                          ? "bg-indigo-500/20 border border-indigo-500/40 text-indigo-300"
                          : "bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/60"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">{error}</p>
              )}

              <GradientButton className="w-full" onClick={handleSubmit} loading={loading}>
                Add Expense
              </GradientButton>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}