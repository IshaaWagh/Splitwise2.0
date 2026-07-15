"use client"

import { useSession, signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"  // 👈 add useSearchParams
import { useEffect, Suspense } from "react"

// Wrap in a separate component because useSearchParams needs Suspense
function SignInContent() {
  const { status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Read the callbackUrl from the URL — e.g. /join/abc123
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard"

  useEffect(() => {
    if (status === "authenticated") router.replace(callbackUrl)
  }, [status, router, callbackUrl])

  if (status === "loading" || status === "authenticated") {
    return (
      <div style={{ minHeight: "100vh", background: "#050505", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid #333", borderTopColor: "#fff", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "#050505", display: "flex", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* Left panel */}
      <div style={{ flex: 1, display: "none", flexDirection: "column", justifyContent: "space-between", padding: "56px", borderRight: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }} className="lg-panel">
        <style>{`@media (min-width: 1024px) { .lg-panel { display: flex !important; } } @keyframes spin { to { transform: rotate(360deg) } }`}</style>
        <div style={{ position: "absolute", top: -80, left: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(99,102,241,0.15)", filter: "blur(100px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, right: -60, width: 350, height: 350, borderRadius: "50%", background: "rgba(139,92,246,0.12)", filter: "blur(100px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>Splitwise 2.0</span>
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, padding: "6px 14px", marginBottom: 24 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px #10b981" }} />
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 500 }}>Real-time sync · Built for India</span>
          </div>
          <h2 style={{ fontSize: 44, fontWeight: 800, color: "#fff", lineHeight: 1.1, letterSpacing: "-1px", margin: "0 0 16px" }}>
            Split bills.<br />
            <span style={{ color: "rgba(255,255,255,0.3)" }}>Not friendships.</span>
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 360, margin: 0 }}>
            Add expenses, split any way you like, and settle instantly with UPI. Every member sees every update — live.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 32, marginTop: 32 }}>
            {[["₹0","Forever free"],["Live","Real-time"],["UPI","One-tap settle"]].map(([val, label], i) => (
              <div key={val} style={{ display: "flex", alignItems: "center", gap: 32 }}>
                <div>
                  <p style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: 0 }}>{val}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: "2px 0 0" }}>{label}</p>
                </div>
                {i < 2 && <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.08)" }} />}
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, background: "rgba(255,255,255,0.03)", padding: 20 }}>
          <div style={{ display: "flex", gap: 3, marginBottom: 10 }}>
            {[...Array(5)].map((_,i) => <span key={i} style={{ color: "#fbbf24", fontSize: 13 }}>★</span>)}
          </div>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: "0 0 16px" }}>
            "Finally stopped the awkward 'hey you still owe me' texts. Everyone in our flat uses this now."
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>A</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.75)", margin: 0 }}>Arjun M.</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: "1px 0 0" }}>IIT Bombay · Mumbai</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <div style={{ width: "100%", maxWidth: 360 }}>

          {/* Show invite context if joining a group */}
          {callbackUrl.startsWith("/join/") && (
            <div style={{ marginBottom: 20, padding: "12px 16px", borderRadius: 12, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>👥</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#818cf8", margin: 0 }}>You've been invited!</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "2px 0 0" }}>Sign in to join the group</p>
              </div>
            </div>
          )}

          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }} className="mobile-logo">
              <style>{`@media (min-width: 1024px) { .mobile-logo { display: none !important; } }`}</style>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>Splitwise 2.0</span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.5px" }}>
              {callbackUrl.startsWith("/join/") ? "Join the group" : "Welcome back"}
            </h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", margin: "6px 0 0" }}>
              {callbackUrl.startsWith("/join/") ? "Sign in with Google to continue" : "Sign in to manage your expenses"}
            </p>
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl })}  // 👈 uses dynamic callbackUrl
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              padding: "14px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 14, fontWeight: 500,
              cursor: "pointer", transition: "all 0.2s", outline: "none",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-4z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.5-4.6 5.9l6.2 5.2C40.8 35.7 44 30.3 44 24c0-1.3-.1-2.7-.4-4z"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.1em" }}>what you get</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: "⚡", title: "Live updates", desc: "Expenses sync instantly across all members" },
              { icon: "🧮", title: "Smart settle-up", desc: "Minimises transactions to clear all debts" },
              { icon: "📲", title: "UPI payments", desc: "One-tap payment links for every settlement" },
            ].map(f => (
              <div key={f.title} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
                <span style={{ fontSize: 16, marginTop: 1 }}>{f.icon}</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.75)", margin: 0 }}>{f.title}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: "2px 0 0", lineHeight: 1.5 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.18)", textAlign: "center", marginTop: 28 }}>
            By signing in you agree to our Terms of Service.
          </p>
        </div>
      </div>
    </div>
  )
}

// Suspense wrapper required for useSearchParams in Next.js
export default function SignInPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "#050505", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid #333", borderTopColor: "#fff", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}