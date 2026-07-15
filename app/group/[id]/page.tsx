// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"
// import { prisma } from "@/lib/prisma"
// import { redirect, notFound } from "next/navigation"
// import { formatCurrency, formatDate, getInitials } from "@/lib/utils"
// import { GlassCard } from "@/components/ui/glass-card"
// import { EmptyState } from "@/components/ui/empty-state"
// // import GroupPageClient from "./group-page-client"
// import GroupPageClient from "./group-page-client"

// export default async function GroupPage({ params }: { params: { id: string } }) {
//   const session = await getServerSession(authOptions)
//   if (!session?.user?.email) redirect("/signin")

//   const user = await prisma.user.findUnique({ where: { email: session.user.email } })
//   if (!user) redirect("/signin")

//   const group = await prisma.group.findUnique({
//     where: { id: params.id },
//     include: {
//       members: { include: { user: true } },
//       expenses: {
//         include: {
//           paidBy: true,
//           splits: { include: { user: true } },
//         },
//         orderBy: { createdAt: "desc" },
//       },
//     },
//   })

//   if (!group) notFound()

//   const isMember = group.members.some((m) => m.userId === user.id)
//   if (!isMember) redirect("/dashboard")

//   // Calculate balances
//   const balances: Record<string, number> = {}
//   group.members.forEach((m) => { balances[m.userId] = 0 })

//   group.expenses.forEach((expense) => {
//     expense.splits.forEach((split) => {
//       if (!split.isSettled) {
//         if (expense.paidById !== split.userId) {
//           balances[expense.paidById] = (balances[expense.paidById] || 0) + split.amount
//           balances[split.userId] = (balances[split.userId] || 0) - split.amount
//         }
//       }
//     })
//   })

//   const totalSpend = group.expenses.reduce((s, e) => s + e.amount, 0)
//   const myBalance = balances[user.id] ?? 0

//   return (
//     <GroupPageClient
//       group={group}
//       currentUserId={user.id}
//       balances={balances}
//       totalSpend={totalSpend}
//       myBalance={myBalance}
//       inviteCode={group.inviteCode}
//     />
//   )
// }
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import GroupPageClient from "./group-page-client"


export default async function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/signin")
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  })

  if (!user) {
    redirect("/signin")
  }

  const group = await prisma.group.findUnique({
    where: {
      id,
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
      expenses: {
        include: {
          paidBy: true,
          splits: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })

  if (!group) {
    notFound()
  }

  const isMember = group.members.some(
    (member) => member.userId === user.id
  )

  if (!isMember) {
    redirect("/dashboard")
  }

  const balances: Record<string, number> = {}

  group.members.forEach((member) => {
    balances[member.userId] = 0
  })

  group.expenses.forEach((expense) => {
    expense.splits.forEach((split) => {
      if (!split.isSettled && expense.paidById !== split.userId) {
        balances[expense.paidById] =
          (balances[expense.paidById] || 0) + split.amount

        balances[split.userId] =
          (balances[split.userId] || 0) - split.amount
      }
    })
  })

  const totalSpend = group.expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  )

  const myBalance = balances[user.id] ?? 0

  return (
    <GroupPageClient
      group={group}
      currentUserId={user.id}
      balances={balances}
      totalSpend={totalSpend}
      myBalance={myBalance}
      inviteCode={group.inviteCode}
    />
  )
}
