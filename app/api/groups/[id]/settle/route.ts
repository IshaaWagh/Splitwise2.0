import { getUserFromCookies } from "@/lib/get-user"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: groupId } = await params
    const user = await getUserFromCookies()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { toUserId, amount } = await req.json()

    if (!toUserId || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    // Record the settlement in DB
    const settlement = await prisma.settlement.create({
      data: {
        groupId,
        fromUserId: user.id,
        toUserId,
        amount: Number(amount),
        status: "completed",
      },
    })

    // Mark the relevant expense splits as settled
    // Find all unsettled splits where this user owes the other user
    const expensesWhereOtherPaid = await prisma.expense.findMany({
      where: {
        groupId,
        paidById: toUserId,
      },
      include: {
        splits: {
          where: {
            userId: user.id,
            isSettled: false,
          },
        },
      },
    })

    // Mark them all as settled
    const splitIds = expensesWhereOtherPaid
      .flatMap(e => e.splits)
      .map(s => s.id)

    if (splitIds.length > 0) {
      await prisma.expenseSplit.updateMany({
        where: { id: { in: splitIds } },
        data: { isSettled: true },
      })
    }

    return NextResponse.json({ settlement, settledSplits: splitIds.length })
  } catch (error: any) {
    console.error("Settlement error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}