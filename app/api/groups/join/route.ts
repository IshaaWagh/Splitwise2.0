import { getUserFromCookies } from "@/lib/get-user"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const user = await getUserFromCookies()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { inviteCode } = await req.json()
    if (!inviteCode?.trim()) {
      return NextResponse.json({ error: "Invite code is required" }, { status: 400 })
    }

    // Find group by invite code
    const group = await prisma.group.findUnique({
      where: { inviteCode: inviteCode.trim() },
    })

    if (!group) {
      return NextResponse.json(
        { error: "Invalid invite code. Double-check the link." },
        { status: 404 }
      )
    }

    // Already a member? Just return the group
    const existing = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: { groupId: group.id, userId: user.id },
      },
    })

    if (existing) {
      return NextResponse.json({ groupId: group.id, alreadyMember: true })
    }

    // Add as member
    await prisma.groupMember.create({
      data: {
        groupId: group.id,
        userId: user.id,
        role: "member",
      },
    })

    return NextResponse.json({ groupId: group.id, alreadyMember: false })
  } catch (error: any) {
    console.error("Join group error:", error)
    return NextResponse.json(
      { error: error?.message ?? "Something went wrong" },
      { status: 500 }
    )
  }
}