"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { formatCurrency, getInitials } from "@/lib/utils"
import { useState } from "react"

interface Group {
  id: string
  name: string
  members: any[]
  expenses: any[]
}

interface GroupCardsProps {
  groups: Group[]
  userId: string
}

function GroupCard({ group, userId }: { group: Group; userId: string }) {
  const [hovered, setHovered] = useState(false)

  const totalSpend = group.expenses.reduce((s: number, e: any) => s + e.amount, 0)
  const myBalance = group.expenses.reduce((sum: number, expense: any) => {
    if (expense.paidById === userId) {
      const othersOwed = expense.splits
        .filter((s: any) => s.userId !== userId && !s.isSettled)
        .reduce((a: number, s: any) => a + s.amount, 0)
      return sum + othersOwed
    } else {
      const myShare = expense.splits.find((s: any) => s.userId === userId && !s.isSettled)
      return sum - (myShare?.amount ?? 0)
    }
  }, 0)

  return (
    <Link href={`/group/${group.id}`} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          padding: 20,
          background: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${hovered ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.07)"}`,
          borderRadius: 16,
          cursor: "pointer",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
          transition: "all 0.2s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{
            width: 150, height: 42, borderRadius: 12,
            background: "linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.2))",
            border: "1px solid rgba(99,102,241,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 700, color: "#818cf8",
          }}>
            {group.name.charAt(0).toUpperCase()}
          </div>
          <ArrowUpRight size={14} color={hovered ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)"} style={{ transition: "color 0.2s" }} />
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: "0 0 3px" }}>
          {group.name}
        </h3>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: "0 0 16px" }}>
          {group.members.length} member{group.members.length !== 1 ? "s" : ""} · {group.expenses.length} expense{group.expenses.length !== 1 ? "s" : ""}
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", margin: "0 0 2px" }}>Total spent</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>
              {formatCurrency(totalSpend)}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", margin: "0 0 2px" }}>Your balance</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: myBalance >= 0 ? "#34d399" : "#fb7185", margin: 0 }}>
              {myBalance >= 0 ? "+" : ""}{formatCurrency(myBalance)}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 14, marginLeft: 0 }}>
          {group.members.slice(0, 5).map((m: any, i: number) => (
            <div key={m.id} style={{
              width: 24, height: 24, borderRadius: 7,
              border: "2px solid #050505",
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 9, fontWeight: 700, color: "#fff",
              marginLeft: i === 0 ? 0 : -6,
              overflow: "hidden", position: "relative", zIndex: 5 - i,
            }}>
              {m.user?.image
                ? <img src={m.user.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : getInitials(m.user?.name ?? "U")}
            </div>
          ))}
          {group.members.length > 5 && (
            <div style={{
              width: 24, height: 24, borderRadius: 7,
              border: "2px solid #050505",
              background: "rgba(255,255,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 9, color: "rgba(255,255,255,0.5)",
              marginLeft: -6,
            }}>
              +{group.members.length - 5}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default function GroupCards({ groups, userId }: GroupCardsProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }} className="groups-grid">
      <style>{`@media(max-width:900px){.groups-grid{grid-template-columns:repeat(2,1fr)!important}}@media(max-width:600px){.groups-grid{grid-template-columns:1fr!important}}`}</style>
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} userId={userId} />
      ))}
    </div>
  )
}