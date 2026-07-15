"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function JoinGroupButton() {
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleJoin() {
    const trimmed = code.trim()
    if (!trimmed) return setError("Enter an invite code or paste the full link")

    setLoading(true)
    setError("")

    try {
      // Extract code if full URL is pasted
      // e.g. "http://localhost:3000/join/abc123" → "abc123"
      let inviteCode = trimmed
      if (trimmed.includes("/join/")) {
        inviteCode = trimmed.split("/join/")[1]
      }

      const res = await fetch("/api/groups/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      router.push(`/group/${data.groupId}`)
      router.refresh()
    } catch (e: any) {
      setError(e.message)
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: "9px 16px", borderRadius: 10, fontSize: 13, fontWeight: 500,
          border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
          color: "rgba(255,255,255,0.6)", cursor: "pointer", transition: "all 0.2s",
          fontFamily: "inherit",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
      >
        🔗 Join Group
      </button>
    )
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
    }}
      onClick={e => e.target === e.currentTarget && setOpen(false)}
    >
      <div style={{
        width: "100%", maxWidth: 440,
        background: "#0d0d0d",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20, padding: 28,
        margin: 16,
      }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>
            Join a group
          </h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: 0 }}>
            Paste the invite link or just the code
          </p>
        </div>

        <input
          autoFocus
          type="text"
          placeholder="Paste invite link or code here..."
          value={code}
          onChange={e => { setCode(e.target.value); setError("") }}
          onKeyDown={e => e.key === "Enter" && handleJoin()}
          style={{
            width: "100%", padding: "13px 16px",
            background: "rgba(255,255,255,0.05)",
            border: `1px solid ${error ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.1)"}`,
            borderRadius: 12, fontSize: 14, color: "#fff",
            outline: "none", boxSizing: "border-box",
            fontFamily: "inherit", marginBottom: 8,
          }}
        />

        {error && (
          <p style={{ fontSize: 12, color: "#f87171", margin: "0 0 12px" }}>{error}</p>
        )}

        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", margin: "0 0 20px", lineHeight: 1.6 }}>
          The invite link looks like:<br />
          <span style={{ color: "rgba(99,102,241,0.8)", fontFamily: "monospace" }}>
            localhost:3000/join/abc123xyz
          </span>
        </p>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => setOpen(false)}
            style={{
              flex: 1, padding: "12px 0", borderRadius: 12, fontSize: 14,
              border: "1px solid rgba(255,255,255,0.08)", background: "transparent",
              color: "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleJoin}
            disabled={loading}
            style={{
              flex: 2, padding: "12px 0", borderRadius: 12, fontSize: 14, fontWeight: 600,
              border: "none",
              background: loading ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
              color: "#fff", cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 8,
            }}
          >
            {loading ? (
              <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", animation: "spin 0.8s linear infinite" }} />
            ) : "Join Group →"}
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}